interface UserInfo{
    id: number
    userName: string
    email: string
    password: string
}

interface UserLoginDto{
    userName: string
    password: string
}

interface UserSignupDto {
    userName: string,
    email: string,
    password: string
}

export { UserInfo, UserLoginDto, UserSignupDto }