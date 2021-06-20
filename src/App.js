import { observer } from "mobx-react-lite";
import { Link, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { useStore } from "./hooks";
import NotFound from "./NotFound";
import Home from "./Home";
import Auth from "./Auth";


const Header = styled.header`
	margin-top: 20px;
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
`;
const Title = styled(Link)`
	font-family: Gilroy-Extrabold, serif;	
	line-height: 40px;
	font-size: 28px;
	color: black;
`;
const User = styled.div`
	cursor: pointer;
	user-select: none;
	transition: .4s opacity ease;
	color: black;
	> * {
		float: left;
	}
	> p {
		line-height: 40px;
		margin-right: 14px;
	}
	&:hover {
		opacity: 0.6;
	}
`;
const StyledApp = styled.div`
	padding: 40px;
`;
const Content = styled.div`
	margin-top: 40px;
`;
const Image = styled.div`
	background-image: url(${p => p.src});
	background-repeat: no-repeat;
    background-position: center;
    width: 40px;
    height: 40px;
`;

const App = observer(() => {
	const { 
		user,
		logOut
	} = useStore();

	return (
		<StyledApp>
			<Header>
				<Title to="/">Заметки</Title>
				{ "id" in user ?
				<User onClick={logOut}>
					<p>{user.login}</p>
					<Image src="/user.svg" />
				</User> :
				<Link to="/auth">
					<User>
						<p>Войти</p>
						<Image src="/login.svg" />
					</User>
				</Link>
				}
			</Header>
			<Content>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="/auth">
						<Auth />
					</Route>
					<Route component={NotFound} />
				</Switch>
			</Content>
		</StyledApp>
	);
});

export default App;
