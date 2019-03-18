import { Face } from '@material-ui/icons';
import Main from './Main/Main';
import User from './User/User';
import Class from './Class/Class';

const Routes = [
    {
        path: '/',
        name: '내정보',
        icon: Face,
        component: Main
    },
    {
        path: '/user',
        name: '유저관리',
        icon: Face,
        component: User
    },
    {
        path: '/class',
        name: '교육관리',
        icon: Face,
        component: Class
    },
    {
        path: '/standard',
        name: '기준관리',
        icon: Face,
        component: Main
    },
    {
        path: '/config',
        name: '이수조건관리',
        icon: Face,
        component: Main
    }
];

export default Routes;