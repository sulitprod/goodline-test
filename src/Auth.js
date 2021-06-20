import { useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "./hooks";

const Input = styled.input`
	font-size: 16px;
	line-height: 18px;
	width: 100%;
	border: 2px solid #D9D9D9;
	border-radius: 10px;
	padding: 14px 20px;
	transition: .4s border-color ease;
	height: 50px;

	&:hover {
		border-color: #d0d0d0;
	}
	&:focus {
		border-color: #23A3FF;
	}
`;
const ButtonTemp = styled.div`
	border-radius: ${p => p.size === "small" ? 4 : 10}px;
	line-height: ${p => p.size === "small" ? 28 : 40}px;
	font-size: 14px;
	padding: 0 14px;
	cursor: pointer;
	transition: .4s background ease;
	text-align: center;
	user-select: none;
`;
const MainButton = styled(ButtonTemp)`
	background: #23A3FF;
	color: white;
`;
const SubButton = styled(ButtonTemp)`
	background: #F2F2F2;

	&:hover {
		background: #d0d0d0;
	}
`;
const Buttons = styled.div`
    display: flex;
    > div {
        width: 100%;
    }
    > div + div {
        margin-left: 20px;
    }
`;
const LoginForm = styled.div`
    width: 100%;
    max-width: 400px;
    > * + * {
        margin-top: 20px;
    }
`;

const Auth = () => {
    const [login, setLogin] = useState('');
    const [pass, setPass] = useState('');
    const { logIn, registration, user } = useStore();

    const changeLogin = ({ target: { value } }) => setLogin(value);
    const changePass = ({ target: { value } }) => setPass(value);

    return (
        user && 'id' in user ?
        <Redirect to="/" /> :
        <LoginForm>
            <Input placeholder="Логин" value={login} onChange={changeLogin} />
            <Input placeholder="Пароль" type="password" value={pass} onChange={changePass} />
            <Buttons>
                <MainButton onClick={() => logIn(login, pass)}>Войти</MainButton>
                <SubButton onClick={() => registration(login, pass)}>Регистрация</SubButton>
            </Buttons>
        </LoginForm>
    )
};

export default Auth;