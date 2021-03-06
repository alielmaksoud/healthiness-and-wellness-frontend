import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CookieService from '../../Service/CookieService';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditCategory from './EditCategory';
import axios from 'axios';
import Card from './popup'
import Popup from 'reactjs-popup';


function ManageCategory() {
  const [Categories, setCategories] = useState([])
  const [Loading, setLoading] = useState(true)
  const [Editing, setEditing] = useState(false)
  const [CategoryData, setCategoryData] = useState({})
  const [display, setdisplay] = useState({display: 'None', color: 'red' });
  const [message, setmessage] = useState("none");
    const useStyles = makeStyles((theme) => ({
        adminsTable: {
          color: 'green',
          position: 'absolute',
          zIndex: '0',
          width: '70%',
          height: '70vh',
          marginTop: '1%',
          marginLeft: '15%',
         
        },
        backdrop: {
          zIndex: theme.zIndex.drawer + 1,
          color: 'green',
        },
        manageadmins : {
          /* backgroundColor: "rgba(116, 255, 116, 0.145)", */
          height : '86vh',
        }
      }));
    const adminsTable = useStyles();
    const cookie = CookieService.get('Bearer');

    

   const HandleEdit = () => {
      setEditing(!Editing)
    }
 
    useEffect( () => {
      setLoading(true)
      var config = {
        method: 'get',
        url: 'http://localhost:8000/api/category',
        headers: { 
          'Authorization': `Bearer ${cookie}`, 
          'Content-Type': 'application/x-www-form-urlencoded'
        }};
          axios(config)
          .then(res => {
                  setCategories(res.data.map((item, index)=>  
                    {return {
                        ...item,
                        delete: {id: item.id},
                        edit: {id: item.id, index: index },
                        /* image   : linkkk + item.picture, */
                    }}));
                    setLoading(false)
          }).catch(err => {
            console.log(err.request)
          })
    },[]);
    console.log(Categories)
    const DeleteCategory = async (id) => {
        setLoading(true);
 
        var config = {
        method: 'Delete',
        url: `http://localhost:8000/api/admin/category/${id}`,
        headers: { 
          'Authorization': `Bearer ${cookie}`, 
          'Content-Type': 'application/x-www-form-urlencoded'
        }};
  
          axios(config)
          .then(res => {
            setmessage("Category has been Deleted")
            setdisplay({display: 'inline', color: 'green' })
            /* props.Edit() */
            window.location.replace("/admin/ManageCategory")
            setCategories(res.data.map(item =>  
              {return {
                  ...item,
                  delete: item.id,
                  edit: item.id,
                  /* image   : linkkk + item.picture */
              }}));
                  
          }).catch(err => {
            console.log(err.request)
          })

          /* axios(config2)
          .then(res => {
    
          }).catch(err => {
            console.log(err.request)
          }) */
          setLoading(false)
    }
    const columns = [

      { field: 'id', headerName: 'ID', width:65},
      { field: 'category_name', headerName: 'Category' , width: 250 },
      { field: 'description', headerName: 'description' , width: 250 },
      {
        field: 'view',
        headerName: 'view',
        width: 110,
        renderCell: (params) => (
        
            <Popup trigger={<Button variant="contained" size="small" alt="Remy Sharp">View</Button>} modal nested position="right center">
            <Card details={params.row}/>
          </Popup>
        ),
      },
      {
        field: 'edit',
        headerName: 'Edit',
        renderCell: (params) => (
        
            <Button style={{backgroundColor: '#36C14B'}} variant="contained" size="small" alt="Remy Sharp" onClick={
               () =>  {
                setCategoryData(Categories[params.value.index]);
                setEditing(true);
               }}>
                Edit
            </Button>
        ),
      },
      {
        field: 'delete',
        headerName: 'Delete',
        sortable: false,
        renderCell: (params) => (
            <Button onClick={()=> DeleteCategory(params.value.id)} style={{backgroundColor: '#F76363'}} variant="contained" size="small" alt="Remy Sharp">
                Delete
            </Button>
        ),
      },
      
    ];
    console.log(HandleEdit)
    if(Loading){
      return (
        <div>
            <Backdrop className={adminsTable.backdrop} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
      )
    }
    if(Editing){
      return (
        <div>
            <EditCategory CategoryData={CategoryData} Edit={HandleEdit} />
        </div>
      )
    }else {
  return (
    <div className={adminsTable.manageadmins} >
    <div className={adminsTable.adminsTable} >
    {<span style={display}>{message}</span>}
      <DataGrid rows={Categories} columns={columns} pageSize={8}/>
    </div>
    </div>
  );
    }
}


export default ManageCategory;