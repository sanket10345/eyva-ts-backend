import * as fs from 'fs';
import express, { Request, Response } from 'express';

const router = express.Router();

interface Member {
    id: number;
    name: string;
    userName: string;
    avatar: string;
    isActive: boolean;
    role: string;
    email: string;
    teams: string[];
}

let membersList: Member[] = [];

try {
    const rawMembers = fs.readFileSync('./src/utils/members.json', 'utf-8');
    membersList = JSON.parse(rawMembers);
} catch (err) {
    console.error('Error loading members:', err);
}

let nextId = 1;

// GET /members - Retrieve all members
router.get('/members', (req: Request, res: Response) => {
    const { page = '1', limit = '10', sortBy = 'name', order = 'asc', search = '' } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const sortOrder = order as 'asc' | 'desc';

    // Filter members based on search query
    let filteredMembers = membersList.filter(member =>
        Object.values(member).some(value =>
            value.toString().toLowerCase().includes((search as string).toLowerCase())
        )
    );

    // Sort members
    filteredMembers.sort((a, b) => {
        if (sortOrder === 'desc') {
            return a[sortBy as keyof typeof a] < b[sortBy as keyof typeof b] ? 1 : -1;
        } else {
            return a[sortBy as keyof typeof a] > b[sortBy as keyof typeof b] ? 1 : -1;
        }
    });

    // Paginate members
    const startIndex = (pageNumber - 1) * limitNumber;
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + limitNumber);

    res.status(200).json({
        items: paginatedMembers,
        count: filteredMembers.length,
        page: pageNumber,
        limit: limitNumber,
    });
});

// GET /members/:id - Retrieve a member by id
router.get('/members/:id', (req: Request, res: Response) => {
    const member = membersList.find(m => m.id === parseInt(req.params.id, 10));
    if (member) {
        res.status(200).json(member);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
});

// POST /members - Create a new member
router.post('/members', (req: Request, res: Response) => {
    const newMember: Member = {
        id: nextId++,
        name: req.body.name,
        userName: req.body.userName,
        avatar: req.body.avatar,
        isActive: req.body.isActive,
        role: req.body.role,
        email: req.body.email,
        teams: req.body.teams,
    };
    membersList.push(newMember);
    res.status(201).json(newMember);
});

// PUT /members/:id - Update a member by id
router.put('/members/:id', (req: Request, res: Response) => {
    const member = membersList.find(m => m.id === parseInt(req.params.id, 10));
    if (member) {
        member.name = req.body.name;
        member.userName = req.body.userName;
        member.avatar = req.body.avatar;
        member.isActive = req.body.isActive;
        member.role = req.body.role;
        member.email = req.body.email;
        member.teams = req.body.teams;
        res.status(200).json(member);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
});

// DELETE /members/:id - Delete a member by id
router.delete('/members/:id', (req: Request, res: Response) => {
    const memberIndex = membersList.findIndex(m => m.id === parseInt(req.params.id, 10));
    if (memberIndex !== -1) {
        const [deletedMember] = membersList.splice(memberIndex, 1);
        res.status(200).json(deletedMember);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
});

export default router;