import { AccountBox, Face, Book, Settings, NoteAdd } from '@material-ui/icons';
import Main from './Main/Main';
import User from './User/User';
import Class from './Class/Class';
import PrintConfig from './PrintConfig/PrintConfig';
import CSV from './CSV/CSV';

const Routes = [
    {
        path: '/',
        name: '내정보',
        icon: AccountBox,
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
        icon: Book,
        component: Class
    },
    {
        path: '/standard',
        name: '기준관리',
        icon: Settings,
        component: PrintConfig
    },
    {
        path: '/csv',
        name: 'CSV업로드',
        icon: NoteAdd,
        component: CSV
    }
];

export default Routes;