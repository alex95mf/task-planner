export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt?: Date;
    updatedAt?: Date;
}
