import Link from "next/link"

const Page: React.FC = () => {
    return (
        <div className='welcome'>
            <h1>Добро пожаловать в Chat!</h1>
            <h2>Для общения <Link href="/login">Войдите</Link> в аккаунт, или <Link href="/register">Зарегистрируйтесь.</Link></h2>
        </div> 
    )
}

export default Page