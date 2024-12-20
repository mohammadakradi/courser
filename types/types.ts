export interface CurriculumItem {
    _class: string;
    id: number;
    title: string;
    description?: string;
    content_summary?: string;
    is_free?: boolean;
    sort_order?: number
}

export interface ReviewItem {
    _class: string;
    id: number;
    content: string;
    rating: number;
    created: string;
    modified?: string;
    user?: UserModel;
    user_modified?: string;
}

export interface UserModel {
    _class: string;
    title: string;
    name: string;
    display_name: string
}

export interface Course {
    _class: string;
    curriculum_items: any[];
    curriculum_lectures: any[];
    headline: string;
    id: number;
    image_125_H: string;
    image_240x135: string;
    image_480x270: string;
    input_features: null;
    instructor_name: null;
    is_paid: boolean;
    is_practice_test_course: boolean;
    lecture_search_result: null;
    locale: Locale;
    order_in_results: null;
    predictive_score: null;
    price: string;
    price_detail: Pricedetail;
    price_serve_tracking_id: string;
    published_title: string;
    relevancy_score: null;
    title: string;
    tracking_id: string;
    url: string;
    visible_instructors: Visibleinstructor[];
}

interface Visibleinstructor {
    _class: string;
    display_name: string;
    image_100x100: string;
    image_50x50: string;
    initials: string;
    job_title: string;
    name: string;
    title: string;
    url: string;
}

interface Pricedetail {
    amount: number;
    currency: string;
    currency_symbol: string;
    price_string: string;
}

interface Locale {
    _class: string;
    english_title: string;
    locale: string;
    simple_english_title: string;
    title: string;
}