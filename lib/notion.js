import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_KEY,
});

const RESOURCES_DATABASE_ID = process.env.NOTION_RESOURCES_DATABASE_ID;
const FOCUS_DATABASE_ID = process.env.NOTION_FOCUS_DATABASE_ID;

// Mock Data for Fallback
const MOCK_RESOURCES = [
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

const MOCK_FOCUS_ITEMS = [
    { id: '1', text: 'Preparing for Google Professional Cloud Architect', progress: 65, color: 'blue' },
    { id: '2', text: 'Studying for AWS Solutions Architect Professional', progress: 30, color: 'orange' },
];


export const getFocusItems = async () => {
    if (!process.env.NOTION_KEY || !FOCUS_DATABASE_ID) {
        return MOCK_FOCUS_ITEMS;
    }

    try {
        const response = await notion.databases.query({
            database_id: FOCUS_DATABASE_ID,
            filter: {
                property: 'Status',
                select: {
                    equals: 'Active',
                },
            },
        });

        return response.results.map(page => ({
            id: page.id,
            text: page.properties.Name.title[0]?.plain_text || 'Untitled',
            progress: page.properties.Progress?.number || 0,
            color: page.properties.Color?.select?.name.toLowerCase() || 'gray'
        }));
    } catch (error) {
        console.error("Notion Error:", error);
        return MOCK_FOCUS_ITEMS;
    }
};


export const getResources = async () => {
    if (!process.env.NOTION_KEY || !RESOURCES_DATABASE_ID) {
        return MOCK_RESOURCES;
    }

    try {
        const response = await notion.databases.query({
            database_id: RESOURCES_DATABASE_ID,
            filter: {
                property: 'Published',
                checkbox: {
                    equals: true,
                },
            },
        });

        return response.results.map(page => ({
            id: page.id,
            title: page.properties.Name.title[0]?.plain_text || 'Untitled',
            category: page.properties.Category?.select?.name || 'General',
            url: page.properties.URL?.url || '#',
            desc: page.properties.Description?.rich_text[0]?.plain_text || ''
        }));

    } catch (error) {
        console.error("Notion Error:", error);
        return MOCK_RESOURCES;
    }
};
