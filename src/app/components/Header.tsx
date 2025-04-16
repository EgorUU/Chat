import {Underdog} from 'next/font/google'
import AccountLink from './AccountLink';
import '@/scss/header.scss'

const underdog = Underdog({
    subsets: ['latin'], // Указываем подмножества символов
    weight: ['400']
})

import Link from 'next/link'

const Header: React.FC = () => {
    
    
    return (
        <header>
            <nav className="navbar bg-dark" style={{display: "flex", justifyContent: "space-between", paddingLeft: "30px", paddingRight: "30px"}}>
                <div className="container-fluid" style={{width:"100px", margin: "0"}}>
                    <Link className="navbar-brand logo" style={{color: 'white', fontFamily: 'Underdog'}} href="/">Messager</Link>
                </div>
                <div className="container-fluid" style={{width: "235px", margin: "0"}}>                    
                    <AccountLink />
                </div>
            </nav>
        </header>
    )
};
export default Header;