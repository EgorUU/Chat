'use client'
import { useSelector } from 'react-redux';
import { VscAccount } from "react-icons/vsc";
import Link from 'next/link'
import { ICurrentAccount } from '@/types/user.interface';

interface RootState {
    currentAccount: ICurrentAccount
}

const AccountLink: React.FC = () => {
    const currentAccount: any = useSelector((state: RootState) => state.currentAccount);
    return currentAccount.name.length > 0 && currentAccount.email.length > 0 && currentAccount.password.length > 0 ?
        <Link href="/" title="Ваш Аккаунт" style={{marginLeft: "auto", display: "flex", gap: "20px", alignItems: "center"}}>
            <VscAccount />
            <h1 style={{fontSize: "25px", margin: "0", textDecoration: "none"}} className='header-name'>{currentAccount.name}</h1>
        </Link>
        : 
        <>
            <Link className="navbar-brand" style={{color: 'white', fontFamily: 'Underdog'}} href="/register">Регистрация</Link>
            <Link className="navbar-brand" style={{color: 'white', fontFamily: 'Underdog'}} href="/login" >Вход</Link>
        </>
};

export default AccountLink
