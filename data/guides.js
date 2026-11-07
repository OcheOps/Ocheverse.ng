// Hands-on guides. Block types: p (supports `inline code`), code {lang, code},
// list [..], note. `draft: true` = reachable by URL for review, but not listed
// and marked noindex. Flip to false to publish.

export const guides = [
  {
    slug: "self-hosted-github-runner-over-tailscale",
    title: "Run your CI on your own GitHub runner when ubuntu-latest isn’t an option",
    summary:
      "A billing lock took away GitHub-hosted runners. Here’s how I moved deploys to a self-hosted runner, and why I had to route my registry pushes over Tailscale to get past Cloudflare’s 100-second limit.",
    level: "Intermediate",
    minutes: 12,
    tags: ["GitHub Actions", "Tailscale", "Docker", "Buildx"],
    date: "2026-11-07",
    draft: false,
    body: [
      { h2: "The situation" },
      {
        p: "One morning every deploy failed in six seconds with `The job was not started because your account is locked due to a billing issue`. The site was fine; the pipeline that ships it was not. GitHub-hosted runners were off the table until support replied, so the pipeline had to run somewhere I controlled.",
      },
      { h2: "1. Pick the host by bandwidth, not by convenience" },
      {
        p: "My first instinct was the homelab: it was idle and already ran a Forgejo runner. It failed for a boring reason. CI downloads every action as a tarball and pushes container layers, and my home uplink to GitHub’s CDN was about 40 KB/s. Action downloads hit the runner’s 100-second HTTP timeout and the job never got past `Set up job`.",
      },
      { p: "Measure before you commit. From the candidate host:" },
      {
        code: `curl -o /dev/null -s -w "speed=%{speed_download}B/s\\n" \\
  https://codeload.github.com/actions/checkout/tar.gz/v5`,
        lang: "bash",
      },
      {
        p: "My VPS did 1.4 MB/s, about 35 times faster. It was also the deploy target, which turned out to be a bonus.",
      },
      { h2: "2. Register the runner as a service" },
      {
        p: "Get a registration token from the API (it expires in an hour), then configure the runner unattended with labels you’ll target from the workflow:",
      },
      {
        code: `gh api -X POST /repos/OWNER/REPO/actions/runners/registration-token --jq .token

./config.sh --unattended --url https://github.com/OWNER/REPO \\
  --token <token> --name my-vps --labels self-hosted,vps,linux,x64
sudo ./svc.sh install "$USER" && sudo ./svc.sh start`,
        lang: "bash",
      },
      {
        note: "Runners are outbound-only: they poll GitHub. Your server needs no open inbound ports for this to work.",
      },
      { h2: "3. Point the workflow at it" },
      {
        code: `jobs:
  build-and-push:
    runs-on: [self-hosted, vps]`,
        lang: "yaml",
      },
      {
        p: "Because the runner now lived on the deploy target, I deleted the SSH deploy step entirely and ran the `docker run` commands directly. One less secret, one less hop.",
      },
      { h2: "4. The part nobody warns you about: Cloudflare 524s" },
      {
        p: "My private registry sits behind a Cloudflare-proxied hostname. Pushing large layers through it failed with HTTP 524: Cloudflare’s Free and Pro plans cut any request that takes more than about 100 seconds, and a big blob over a slow link takes longer than that. No setting raises it below Enterprise.",
      },
      {
        p: "The fix was to stop sending pushes through Cloudflare at all. Both machines were already on my Tailscale network, so on the runner I pinned the registry hostname to the registry host’s Tailscale IP and pushed to the registry’s own port:",
      },
      {
        code: `# /etc/hosts on the runner
<registry-tailscale-ip>  registry.example.com

# /etc/docker/daemon.json
{ "insecure-registries": ["registry.example.com:5000"] }`,
        lang: "bash",
      },
      {
        p: "That alone wasn’t enough, and this cost me two failed runs. Buildx runs BuildKit in its own container with its own DNS and its own registry config, so it ignored both changes. You have to tell it explicitly:",
      },
      {
        code: `- uses: docker/setup-buildx-action@v3
  with:
    driver-opts: network=host          # inherit the host's /etc/hosts
    buildkitd-config-inline: |
      [registry."registry.example.com:5000"]
        http = true
        insecure = true`,
        lang: "yaml",
      },
      {
        note: "Only skip TLS like this when the transport is already encrypted. Tailscale is WireGuard underneath, so the HTTP hop between the two machines never touches the open internet.",
      },
      { h2: "5. Make the slow part cheaper" },
      {
        p: "Pushes still crossed a slow home uplink (a full build and push takes around 18 minutes), so I added BuildKit’s registry cache to let unchanged layers be skipped:",
      },
      {
        code: `cache-from: type=registry,ref=registry.example.com:5000/app:latest
cache-to: type=inline`,
        lang: "yaml",
      },
      { h2: "What I’d tell myself on day one" },
      {
        list: [
          "Test the host’s bandwidth to GitHub before registering anything.",
          "If a proxy sits between CI and your registry, find out its request timeout first.",
          "Remember that Buildx is a separate container: host-level Docker config doesn’t reach it.",
          "Keep the self-hosted runner registered even after billing is sorted. It’s a free fallback for the next outage.",
        ],
      },
    ],
  },
  {
    slug: "vault-backups-without-a-cloud-bill",
    title: "Back up HashiCorp Vault to your homelab, without a cloud bill",
    summary:
      "A free, tested backup for a small Vault: a pull-based nightly copy over Tailscale with a locked-down SSH key, a restore drill, and an alert for when Vault seals itself after a reboot.",
    level: "Intermediate",
    minutes: 10,
    tags: ["Vault", "Backups", "SSH", "Tailscale", "Uptime Kuma"],
    date: "2026-11-07",
    draft: false,
    body: [
      { h2: "Why bother" },
      {
        p: "My Vault had been running for months with no backup at all. One bad disk and every secret behind my deploys would be gone. The textbook answer is S3 snapshots and KMS auto-unseal, but for a one-person setup holding 600 KB of data, a cloud bill felt wrong. The homelab was already there.",
      },
      { h2: "The data is already encrypted" },
      {
        p: "Vault encrypts everything it writes to storage. A copy of its data directory is useless without the unseal keys, so you can store that copy on ordinary disks without adding encryption on top. Keep the unseal keys somewhere else entirely, never next to the backup.",
      },
      { h2: "Pull, don’t push" },
      {
        p: "If the Vault server pushes backups to the homelab, it needs write access there, and a compromised server could delete them. Turn it around: the homelab pulls. The server holds no credentials for the backup machine at all.",
      },
      { h2: "1. A key that can only do one thing" },
      {
        p: "Generate a dedicated key on the homelab. On the Vault server, add it to `authorized_keys` with a forced command, a source-IP restriction and `restrict`, which also disables shells, port forwarding and agent forwarding:",
      },
      {
        code: `from="<homelab-tailscale-ip>",restrict,command="docker run --rm --network none -v /srv/vault_data:/d:ro alpine:3.24 tar czf - -C /d ." ssh-ed25519 AAAA... homelab-vault-backup`,
        lang: "text",
      },
      {
        p: "Whatever the client asks to run, the server runs only that command: a read-only, network-less container that streams a tarball. Using Docker also solves permissions, because the data is owned by Vault’s user and the container can read it without sudo.",
      },
      {
        note: "Check that the server isn’t using Tailscale SSH (`tailscale debug prefs | grep RunSSH` should be false). Tailscale SSH bypasses authorized_keys, and with it your restrictions.",
      },
      { h2: "2. A backup script that refuses bad backups" },
      {
        code: `#!/usr/bin/env bash
set -euo pipefail
DEST="$HOME/backups/vault"; OUT="$DEST/vault-$(date +%F_%H%M).tgz"; TMP="$OUT.partial"
trap 'rm -f "$TMP"' EXIT

ssh -T -o BatchMode=yes -i ~/.ssh/vault_backup user@<vault-tailscale-ip> > "$TMP"

if gzip -t "$TMP" && tar tzf "$TMP" | grep -c '^\\./core/' >/dev/null; then
  mv "$TMP" "$OUT"
  find "$DEST" -name 'vault-*.tgz' -mtime +30 -delete
else
  echo "$(date -Is) FAILED" >> "$DEST/backup.log"; exit 1
fi`,
        lang: "bash",
      },
      {
        p: "Two details matter. The archive is written to a temporary file and only renamed once it passes validation, so a failed night never replaces a good backup.",
      },
      {
        p: "And note `grep -c` rather than `grep -q`. My first version used `grep -q`, which exits on the first match and kills `tar` mid-listing; with `pipefail` set, that reports the whole pipeline as failed. The check rejected a perfectly good backup.",
      },
      { p: "Schedule it nightly:" },
      { code: `30 3 * * * $HOME/bin/vault-backup.sh >/dev/null 2>&1`, lang: "text" },
      { h2: "3. Prove you can restore" },
      {
        p: "A backup you haven’t restored is a hope. Unpack the newest archive and start a throwaway Vault on it:",
      },
      {
        code: `R=$(mktemp -d); tar xzf "$(ls -t ~/backups/vault/*.tgz | head -1)" -C "$R"
docker run -d --name vault-restore-test -v "$R":/vault/file \\
  -e 'VAULT_LOCAL_CONFIG={"storage":{"file":{"path":"/vault/file"}},"listener":[{"tcp":{"address":"127.0.0.1:8200","tls_disable":1}}],"disable_mlock":true}' \\
  hashicorp/vault:1.21.4 server
docker exec vault-restore-test sh -c 'VAULT_ADDR=http://127.0.0.1:8200 vault status'`,
        lang: "bash",
      },
      {
        p: "You want `Initialized: true` and the same key shares and threshold as production. Two traps: give Vault more than a few seconds to start before you query it, and clean up through Docker afterwards, because Vault’s entrypoint changes the owner of the extracted files.",
      },
      { h2: "4. Know when Vault seals itself" },
      {
        p: "Without auto-unseal, every reboot seals Vault, and you usually find out when a deploy fails. `/v1/sys/health` returns 200 when unsealed and 503 when sealed, so a plain HTTP check is enough. I pointed Uptime Kuma on the homelab at it, with a 60-second interval and a notification to my phone.",
      },
      { h2: "Cost" },
      {
        list: [
          "Storage: about 50 KB a night on disks I already own.",
          "Bandwidth: negligible, over Tailscale.",
          "Money: zero.",
        ],
      },
    ],
  },
];

export const publishedGuides = () => guides.filter((g) => !g.draft);
export const draftGuides = () => guides.filter((g) => g.draft);
export const getGuide = (slug) => guides.find((g) => g.slug === slug) || null;
