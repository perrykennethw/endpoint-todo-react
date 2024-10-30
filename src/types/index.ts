export type Task = {
    id: string;
    description: string;
    isComplete: boolean;
    isPastDue?: boolean;
    dueDate?: Date;
};
