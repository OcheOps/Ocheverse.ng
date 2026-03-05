// This file replaces Notion/Spotify APIs. 
// You can edit this file directly to update your "Now" page and "Resources" page.

export const focusItems = [
    {
        id: '1',
        text: 'Preparing for Google Professional Cloud Architect',
        progress: 65,
        color: 'blue' // options: 'blue', 'green', 'orange', 'purple'
    },
    {
        id: '2',
        text: 'Studying for AWS Solutions Architect Professional',
        progress: 30,
        color: 'orange'
    },
    {
        id: '3',
        text: 'Scaling Ocheverse infrastructure on Kubernetes',
        progress: 80,
        color: 'green'
    }
];

export const currentlyListening = {
    isPlaying: true, // change to false if you aren't listening to anything
    title: "Empire State of Mind",
    artist: "JAY-Z, Alicia Keys",
    album: "The Blueprint 3",
    albumImageUrl: "https://upload.wikimedia.org/wikipedia/en/2/2f/The_Blueprint_3.jpg", // Add a URL to album art
    songUrl: "https://open.spotify.com/track/2igwFfvr1OAGXv130o4oN3"
};

export const currentReading = {
    title: "Site Reliability Engineering",
    author: "Google Team",
    progress: 45 // 0-100
};

export const resources = [
    {
        id: '1',
        title: 'Google Cloud PCA Study Guide',
        category: 'Google PCA',
        url: 'https://cloud.google.com/certification/cloud-architect',
        desc: 'Official exam guide and learning path.'
    },
    {
        id: '2',
        title: 'AWS SAP Exam Readiness',
        category: 'AWS SAP',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/',
        desc: 'Official AWS readiness training.'
    },
    {
        id: '3',
        title: 'Kubernetes The Hard Way',
        category: 'Advanced DevOps',
        url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way',
        desc: 'Learn Kubernetes by building a cluster from scratch.'
    },
    {
        id: '4',
        title: 'DevOps Roadmap',
        category: 'Starting Out',
        url: 'https://roadmap.sh/devops',
        desc: 'Step by step guide to becoming a DevOps Engineer.'
    }
];
