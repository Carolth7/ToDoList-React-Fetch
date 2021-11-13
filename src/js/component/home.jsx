import React, { Fragment, useEffect, useState } from "react";
import Task from "./task.jsx";

const URL = "https://assets.breatheco.de/apis/fake/todos/user/CAROL";

const Home = () => {
	const [list, setList] = useState([]);
	const [listOfComponents, setListOfComponents] = useState([]);
	const [failOnUpdating, setFailOnUpdating] = useState("");
	const [update, setUpdate] = useState(false);

	useEffect(() => {
		fetch(URL) // cuando no se pone nada se sobreentiende que es un  GET
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Fail on load");
			})
			.then(responseAsJSON => {
				setUpdate(false);
				setList(responseAsJSON);
			})
			.catch(error => {
				setFailOnUpdating(error.message);
			});
	}, []);

	useEffect(() => {
		if (list.lenght != 0) {
			fetch(URL, {
				method: "PUT",
				body: JSON.stringify(list),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => {
					if (response.ok) {
						setUpdate(false);
					} else {
						throw new Error("Failing updating task List");
					}
				})
				.catch(error => setFailOnUpdating(error.message));
		}
	}, [update]);
	//para que no se haga el put todo el rato

	useEffect(() => {
		if (list.length != 0) {
			setListOfComponents(
				list.map((inputValue, index) => {
					return (
						<Task
							key={index.toString()}
							id={index.toString()}
							label={inputValue.label}
							delete={deleteTask}
						/>
					);
				})
			);
		}
	}, [list]);

	//te devuelve los elementos menos el marcado como hecho

	const deleteTask = id => {
		setList(list.filter((_, index) => index != id));
		setUpdate(true);
	};

	// si no queremos eliminarla, y queremos cambiar el estado, hacemos un map para que te devuelva la lista entera con todos modificandolo
	// const deleteTask = probslabel => {
	// 	let aux = list.map(task => {
	// 		if (task.label == probslabel) {
	// 			return { label: task.label, done: !task.done };
	// 		} else {
	// 			return task;
	// 		}
	// 	});
	// 	setList(aux);
	// 	setUpdate(true);
	// 	// para el put
	// };

	console.log("aqui esta list", list);
	console.log("aqui esta todolist", listOfComponents);

	return (
		<Fragment>
			<div className="todoList">
				{/* si no hay fallo, no hagas nada, si lo hay haz esto */}
				{!failOnUpdating && <h1>{failOnUpdating}</h1>}
				<h1>TO DO LIST</h1>
				<form
					// method="POST"
					onSubmit={event => {
						event.preventDefault();
						setUpdate(true);
						setList([
							...list,
							{
								label: document.querySelector("input").value,
								done: false
							}
						]); // sin los tres puntos aplastaria el valor
					}}
					action="">
					<input type="text" placeholder="añade tarea nueva..." />
				</form>
				<ul>{listOfComponents}</ul>
			</div>
		</Fragment>
	);
};

export default Home;
