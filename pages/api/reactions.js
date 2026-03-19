import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const REACTIONS_FILE = path.join(DATA_DIR, 'reactions.json');

const ALLOWED_REACTIONS = ['fire', 'rocket', 'brain', 'heart', 'clap'];

function readReactions() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(REACTIONS_FILE)) return {};
    return JSON.parse(fs.readFileSync(REACTIONS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function writeReactions(data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(REACTIONS_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'slug is required' });
  }

  const reactions = readReactions();

  if (req.method === 'GET') {
    return res.status(200).json(reactions[slug] || {});
  }

  if (req.method === 'POST') {
    const { reaction } = req.body;

    if (!ALLOWED_REACTIONS.includes(reaction)) {
      return res.status(400).json({ error: 'Invalid reaction' });
    }

    if (!reactions[slug]) reactions[slug] = {};
    if (!reactions[slug][reaction]) reactions[slug][reaction] = 0;
    reactions[slug][reaction]++;

    writeReactions(reactions);
    return res.status(200).json(reactions[slug]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
