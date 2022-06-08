import axios from "axios";
import React, { useEffect, useState } from "react";

const ListPerson = () => {
    const [persons, setPersons] = useState([]);
    const [isEdit, setIsEdit] = useState("");
    const [nameChange, setNameChange] = useState("");
    const [namePerson, setNamePerson] = useState("");
    const [showNew, setShowNew] = useState(false);
    const getPesons = async () => {
        const res = await axios.get("http://localhost:3000/api/v1/persons/");
        setPersons(res.data.data.persons.sort((a, b) => (a.rankNumber > b.rankNumber) ? 1 : (b.rankNumber > a.rankNumber) ? -1 : 0));
    }
    useEffect(() => {
        getPesons();
    }, []);
    const newPerson = async () => {
        if (!persons.length) {
            await axios.post("http://localhost:3000/api/v1/persons/", { name: namePerson, rankNumber: 1 })
                .then(res => {
                    alert("Add person successfully");
                    getPesons();
                })
                .catch(error => {
                    alert(error);
                })
        } else {
            await axios.post("http://localhost:3000/api/v1/persons/", { name: namePerson, rankNumber: persons[persons.length - 1].rankNumber + 1 })
                .then(res => {
                    alert("Add person successfully");
                    getPesons();
                })
                .catch(error => {
                    alert(error);
                })
        }

    }
    const deletePerson = async (id) => {
        if (window.confirm("You want delete person?")) {
            await axios.delete(`http://localhost:3000/api/v1/persons/${id}`)
                .then(res => {
                    alert("Delete person successfully");
                    getPesons();
                })
                .catch(error => {
                    alert(error);
                })
        } else {
            alert("Cancel")
        }

    }
    const editPerson = async (person) => {
        await axios.patch(`http://localhost:3000/api/v1/persons/${person.id}`, { name: nameChange, rankNumber: person.rankNumber })
            .then(res => {
                getPesons();
                setNameChange("");
            })
            .catch(error => {
                alert(error);
            })
    }
    const movePersonUp = async (person) => {
        const index = persons.indexOf(person);
        await axios.patch(`http://localhost:3000/api/v1/persons/${person.id}`, { name: person.name, rankNumber: persons[index - 1].rankNumber });
        await axios.patch(`http://localhost:3000/api/v1/persons/${persons[index - 1].id}`, { name: persons[index - 1].name, rankNumber: person.rankNumber });
        getPesons();
    }
    const movePersonDown = async (person) => {
        const index = persons.indexOf(person);
        await axios.patch(`http://localhost:3000/api/v1/persons/${person.id}`, { name: person.name, rankNumber: persons[index + 1].rankNumber });
        await axios.patch(`http://localhost:3000/api/v1/persons/${persons[index + 1].id}`, { name: persons[index + 1].name, rankNumber: person.rankNumber });
        getPesons();
    }
    return (
        <div className="wrapper">
            <div className="title">
                <h4>List Person</h4>
                <button onClick={() => setShowNew(true)}>New Person</button>
            </div>
            <div className="list-person">
                {persons?.map((person, index) => (
                    <div key={person.id} className="person">
                        <span className="stt">{index + 1}</span>
                        {isEdit !== person.id ? (<>
                            <span className="name">{person.name}</span>
                            <button className="edit" onClick={() => { setIsEdit(person.id); setNameChange(person.name) }}><i className="fas fa-pencil-alt"></i></button>
                        </>)
                            : <>
                                <input autoFocus value={nameChange || ""} onChange={(e) => setNameChange(e.target.value)} />
                                <button className="update" onClick={() => { setIsEdit(''); editPerson(person) }}><i className="fas fa-check"></i></button>
                            </>}
                        <button className="delete" onClick={() => deletePerson(person.id)}><i className="fas fa-trash-alt"></i></button>
                        <button disabled={persons.indexOf(person) === 0} className="move" onClick={() => movePersonUp(person)}><i className="fas fa-arrow-up"></i></button>
                        <button disabled={persons.indexOf(person) === persons.length - 1} className="move" onClick={() => movePersonDown(person)}><i className="fas fa-arrow-down"></i></button>
                    </div>
                ))}
            </div>
            {showNew ? <div className="new">
                <label htmlFor="name-input">Name:</label>
                <input type="text" value={namePerson || ""} onChange={(e) => setNamePerson(e.target.value)} />
                <button onClick={(e) => newPerson(e)}>Save</button>
                <i className="fas fa-times" onClick={() => setShowNew(false)}></i>
            </div> : <></>}

        </div>
    )
}
export default ListPerson;