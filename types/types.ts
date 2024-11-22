export interface Course {
    id: number;
    title: string;
    url: string;
    is_paid: boolean;
    price: string;
    visible_instructors: Instructor[];
}

export interface Instructor {
    id: number;
    title: string;
}