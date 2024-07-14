import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import GroupIcon from '@mui/icons-material/Group';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

export const foodCategoryOptions = [
    {
        text: "همه",
        value: ""
    },
    {
        text: "پیش غذا",
        value: "B"
    },
    {
        text: "غذای اصلی",
        value: "M"
    },
    {
        text: "دسر",
        value: "A"
    },

];


export const navbarItems = [
    {
        href: "/",
        text: "خانه",
        icon: <HomeIcon />
    },
    {
        href: "/sharing-food",
        text: "افزودن غذا",
        icon: <LocalDiningIcon />
    },
    {
        href: "/contact-us",
        text: "ارتباط با ما",
        icon: <ContactSupportIcon />
    },
    {
        href: "/profile",
        text: "حساب کاربری",
        icon: <AccountBoxIcon />
    },
];

export const adminNavbarItems = [
    {
        href: "/",
        text: "غذاها",
        icon: <LunchDiningIcon />
    },
    {
        href: "/users",
        text: "کاربران",
        icon: <GroupIcon />
    },
    {
        href: "/profile",
        text: "حساب کاربری",
        icon: <AccountBoxIcon />
    },
];

export const noAuthNavbarItems = [
    {
        href: "/",
        text: "خانه",
        icon: <HomeIcon />
    },
    {
        href: "/contact-us",
        text: "ارتباط با ما",
        icon: <ContactSupportIcon />
    },
    {
        href: "/login",
        text: "ورود/ثبت نام",
        icon: <LoginIcon />
    },
];

export const profileSections = [
    {
        href: "/profile",
        title: "ویرایش اطلاعات"
    },
    {
        href: "/profile/password",
        title: "تغییر رمز عبور"
    },
    {
        href: "/profile/foods",
        title: "غذاها"
    },
    {
        href: "/profile/favorites",
        title: "مورد علاقه‌ها"
    },
];