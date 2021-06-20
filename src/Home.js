import { useStore } from "./hooks";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

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
const StyledNote = styled.div`
	display: flex;

	& + & {
		padding-top: 30px;
	}
    > * + * {
        margin-right: 14px;
    }
`;
const Text = styled.p`
	cursor: pointer;
	opacity: ${p => p.completed ? "0.6" : "1"};
	overflow: hidden;
	text-overflow: ellipsis;
`;
const RadioTemp = styled.div`
	width: 20px;
	height: 20px;
	flex-shrink: 0;
	margin-right: 14px;
	cursor: pointer;
	border-radius: 50%;
`;
const Remove = styled(RadioTemp)`
	background: #E85C5C;
	color: white;
	text-align: center;
`;
const AddNote = styled.div`
	position: fixed;
	right: 40px;
	bottom: 40px;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	font-size: 60px;
	line-height: 60px;
	text-align: center;
	box-shadow: 0px 10px 40px 0 rgb(0 0 0 / 10%);
	background: white;
	cursor: pointer;
	color: #23A3FF;
	transition: .4s box-shadow ease;
	user-select: none;

	&:hover {
		box-shadow: 0px 10px 20px 0 rgb(0 0 0 / 10%);
	}
`;
const Radio = styled(RadioTemp)`
	border: 2px solid #D9D9D9;
	padding: 3px;
	transition: .4s border-color ease;

	&:hover {
		border-color: #d0d0d0;
	}
	> div {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		transition: .4s background ease;
		background: ${p => p.completed ? "#4eb821" : "transparent"};
	}
`;
const WindowStyled = styled.div`
	box-shadow: 0px 10px 40px 0 rgb(0 0 0 / 10%);
	position: fixed;
	width: 100%;
	height: calc(100% - 130px);
	top: ${p => p.windowOpened ? "130px" : "100%"};
	left: 0;
	background: white;
	padding: 40px;
	transition: .4s top ease;
	z-index: 2;
	border-radius: 40px 40px 0 0;
`;
const Textarea = styled.textarea`
	font-size: 16px;
	line-height: 18px;
	width: 100%;
	border: 2px solid #D9D9D9;
	border-radius: 10px;
	padding: 14px 20px;
	transition: .4s border-color ease;
	overflow: hidden;
	resize: none;
	height: 50px;

	&:hover {
		border-color: #d0d0d0;
	}
	&:focus {
		border-color: #23A3FF;
	}
`;
const Buttons = styled.div`
	display: flex;
	max-width: 400px;
	margin-top: 30px;

	> div {
		flex-grow: 1;
	}

	> div + div {
		margin-left: 20px;
	}
`;
const Input = styled.input`
	transition: .4s border-color ease;
    font-size: 14px;
    line-height: 24px;
    width: 100%;
    border: 2px solid #D9D9D9;
    border-radius: 4px;
    padding: 0px 14px;

	&:hover {
		border-color: #d0d0d0;
	}
	&:focus {
		border-color: #23A3FF;
	}
`;
const Functions = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 30px;

    > * + * {
        margin-left: 20px;
    }
`;
const Edit = styled.div`
    background-image: url(/edit.svg);
	background-repeat: no-repeat;
    background-position: center;
    width: 20px;
    height: 20px;
`;

const AddNoteWindow = ({ closeWindow, changeNote, addNote, changeCurrent, current, windowOpened }) => {
	const textarea = useRef(null);
	const resizeInput = () => {
		const { current: { style } } = textarea;
		
		style.height = "";

		const { current: { offsetHeight, clientHeight, scrollHeight } } = textarea;
		const update = offsetHeight - clientHeight;

		style.height = `${scrollHeight + update}px`;
	}
	const textAnalyze = ({ target: { value } }) => {
		changeCurrent({ value });
	}

	useEffect(() => {
		resizeInput();
	}, [current]);

	return (
		<WindowStyled {...{ windowOpened }}>
			<Textarea ref={textarea} onChange={textAnalyze} placeholder="Введите текст заметки" value={current.value} />
			<Buttons>
				<SubButton onClick={closeWindow}>Закрыть</SubButton>
				{ current.edit ? 
				<MainButton onClick={changeNote}>Сохранить</MainButton> :
				<MainButton onClick={addNote}>Добавить</MainButton>
				}
			</Buttons>
		</WindowStyled>
	)
}

const Note = ({ completed, value, onClick, edit, id, startChange, user }) => (
	<StyledNote>
		{ edit ?
		<Remove {...{ onClick }}>-</Remove> :
		<Radio {...{ completed, onClick }}><div /></Radio>
		}
		<Text {...{ completed, onClick: edit ? () => startChange(id) : onClick }}>{value}</Text>
        {
            user.editId.indexOf(id) !== -1 ? <Edit /> : ""
        }
	</StyledNote>
);

const Home = observer(() => {
    const {
		edit,
		addNote, 
		removeNote, 
		changeNote, 
		changeStatus, 
		current, 
		windowOpened,
		closeWindow,
		changeCurrent,
		setEdit,
		openWindow,
		user,
        startChange
	} = useStore();
    const notes = "notes" in user ? user.notes : [];
    const [ sorted, setSorted ] = useState('');
    const search = ({ target: { value }}) => setSorted(value);
    const sortedNotes = notes.filter(n => n.value.indexOf(sorted) !== -1);

    return (
        <>
            { notes.length ? 
            <Functions>
                <SubButton size="small" onClick={() => setEdit(!edit)}>{edit ? "Отменить" : "Править"}</SubButton>
                <Input placeholder="Поиск" onChange={search} />
            </Functions> :
            ""
            }
            { "id" in user ?
            notes.length ? 
            sortedNotes.map(({ id, completed, value }) => (
                <Note {...{ 
                    key: id, 
                    completed, 
                    id, 
                    value, 
                    edit,
                    user,
                    startChange, 
                    onClick: () => edit ? removeNote(id) : changeStatus(id) 
                }} />
            )) : 
            "Список пуст" :
            "Вам необходимо войти, чтобы создавать заметки"
            }
            <AddNoteWindow {...{ closeWindow, changeNote, addNote, changeCurrent, current, windowOpened }} />
            { windowOpened || edit || !("id" in user) ? 
            "" :
            <AddNote onClick={openWindow}>+</AddNote>
            }
        </>
    )
});

export default Home;