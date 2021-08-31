import React, { useState, useEffect, useRef, createRef} from 'react';
import "./Table.css";
import axios from 'axios';

const backendData = "http://178.128.196.163:3000/api/records"

const useEffectTable = () => {
                
    const [dataBackend, setDataBackend] = useState([]);  
    
    useEffect(() => {
        const getBackend = async () => {
            const response = await fetch(backendData);
            const data = await response.json();
            setDataBackend(data);               
        };
        getBackend();              
        }, []);    

    const deletePost = (_id) => {               
        let removeComment = dataBackend.filter((newPers) => newPers._id !== _id)
        setDataBackend(removeComment)
        axios.delete(`${"http://178.128.196.163:3000/api/records/"}${_id}`)        
    }

    const refSurname = useRef('')
    const refName = useRef("");
    const refBtnChange = useRef("");

    const arrLength = dataBackend.length;

    if (refSurname.current.length !== arrLength && refName.current.length !== arrLength && refBtnChange.current.length !== arrLength) {        
        refSurname.current = Array(arrLength).fill().map((_, i) => refSurname.current[i] || createRef());
        refName.current = Array(arrLength).fill().map((_, i) => refName.current[i] || createRef());
        refBtnChange.current = Array(arrLength).fill().map((_, i) => refBtnChange.current[i] || createRef());
    }        

    const changePost = (_id) => {      
        if(refBtnChange.current[0].current.textContent === 'edit'){              
            for (var i = 0; i < refBtnChange.current.length; i++) {                             
                refName.current[i].current.innerHTML = refName.current[i].current.value
                refSurname.current[i].current.innerHTML = refSurname.current[i].current.value                 
                refName.current[i].current.readOnly = false;                
                refSurname.current[i].current.readOnly = false; 
                refBtnChange.current[i].current.textContent = 'save'
            }              
        } 
        else{           
            for (var j = 0; j < refBtnChange.current.length; j++) {                
                refBtnChange.current[j].current.textContent = 'edit'               
                refName.current[j].current.innerHTML = refName.current[j].current.value
                refSurname.current[j].current.innerHTML = refSurname.current[j].current.value                             
                refName.current[j].current.readOnly = true 
                refSurname.current[j].current.readOnly = false;        
                
                if(refName.current[j].current.value !== refName.current[j].current.defaultValue){
                    axios({
                        method: 'post',
                        url: `${"http://178.128.196.163:3000/api/records/"}${_id}`,
                        data: {"data":{                      
                            'name': refName.current[j].current.value,                                              
                            'surname': refSurname.current[j].current.value,                                              
                        }}
                    })                    
                } 
            }            
        } 
    }   
    
    const refNewSurname = useRef('');
    const refNewName = useRef("");

    const addNewOne = async () => {
        if(refNewName.current.value !== "" && refNewSurname.current.value !== ""){
            await axios({
                method: 'put',
                url: 'http://178.128.196.163:3000/api/records',
                data: {"data":{
                    'name': refNewName.current.value,
                    'surname': refNewSurname.current.value
                }}
            });         
            refNewName.current.value = ""
            refNewSurname.current.value = "" 
        } else {
            throw console.error("please fill all inputs!");       
        }        
    };       
    
    return (
        <main className='table'>
            <form id="mainForm" action="http://178.128.196.163:3000/api/records" method="GET">
                <table id="mainTable" style={{border: "0.1em solid black"}}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>                        
                        </tr>                    
                    </thead>                
                    {dataBackend.map((newPers, i) => {
                         const { data, _id} = newPers;
                         if(data !== null && data !== undefined){                     
                            return (                            
                                <tbody key={_id}>
                                    <tr>
                                        <td><input ref={refName.current[i]} className='nameInput' type="text" defaultValue={data.name}  readOnly={true} /></td>                                
                                        <td><input ref={refSurname.current[i]} className="surnameInput" type="text" defaultValue={data.surname} readOnly={true} /></td>                                                                      
                                        <td><i ref={refBtnChange.current[i]} className="changeBtn" onClick={() => changePost(_id, data)}>edit</i></td>                                    
                                        <td><i onClick={() => deletePost(_id)} className={'fas fa-times'}></i></td>                                                                   
                                    </tr>
                                </tbody>
                            );                                        
                    }
                    else {return console.error("data is not exist or equal null")}
                    })}                
                </table>            
            </form>   

            <div className="addForm">
                <h2>Add new (real) user to server</h2>
                <form>
                    <div className="newNameAdd">
                        <label htmlFor="newName">Name</label>
                        <input ref={refNewName} id="newName" type="text" />  
                    </div>
                    <div className="newSurnameAdd">
                        <label htmlFor="newSurname">Surname</label>                            
                        <input ref={refNewSurname} id="newSurname" type="text" />                                                                                  
                    </div>                        
                </form>
                <button id="addNewBtn" onClick={addNewOne}>ADD</button>
            </div>
        </main>
    )
}

export default useEffectTable
