import React,{useState,useEffect} from 'react';
import { Table } from 'semantic-ui-react';
import DataTable from '../DataTable';
import AppliedUser from './AppliedUser';
import { useDispatch, useSelector } from "react-redux";
import {regersterCourse,getCourse} from '../actions/course_action'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
const TACommittee = () => {
  const history=useNavigate()
  // Sample data for Active Jobs table
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getCourse());
  },[])
  const {courses}=useSelector((state)=>state.getAllCourseReducer)
  console.log("MyCourse",courses)
  const [openAppliedUser,setAppliedUser]=useState(false);
  const [opendCourse,setOpendCourse]=useState({})
  let activeJobsData = []
  let deadlinePassedData = []
  let taSettledCoursesData = [] 
  if(courses && courses.length>0)
  {
    //activeJobsData=courses
    for(let i=0;i<courses.length;i++){
      if(courses[i] && courses[i].ta_selected){
        taSettledCoursesData.push(courses[i]) 
      }
      else{
        
        const momentCreatedAt=moment(courses[i].createdAt,'YYYY-MM-DDTHH:mm:ss')
        if (momentCreatedAt.isValid()) {
          const currentDate = moment();
          const differenceInDays = currentDate.diff(momentCreatedAt, 'days');
          if(differenceInDays>5){
            deadlinePassedData.push(courses[i]) 
          }
          else{
            activeJobsData.push(courses[i])
          }
        } else {
          console.error('Invalid date format');
        }
      }
    }
  }

  console.log("all Jobs",activeJobsData,deadlinePassedData,taSettledCoursesData)
  
  const deadlinePassedColumns=[
    { Header: 'SNO', accessor: '_id' },
    { Header: 'Course Name', accessor: 'course_name' },
    { Header: 'Department', accessor: 'department' },
    { Header: 'Professor', accessor: 'professor_name' },
    {Header:'Actions',Cell: ({ row }) => (
      <div>
        <button className='cancel-button' onClick={()=>{onOpenTaApplicants(row.original)}}>open</button>
      </div>
    ),
  }
  ];

  const closeTAApplicantsHandler=()=>{
    setAppliedUser(false);
    setOpendCourse({})
  }

  const onOpenTaApplicants=(data)=>{
    setAppliedUser(true);
    setOpendCourse(data)
  }

  return (
    <div>
      {/* Top Header */}
      {openAppliedUser && <AppliedUser onClose={closeTAApplicantsHandler} isOpend={openAppliedUser} opendCourse={opendCourse} />}
      <div className='top-header'>
        <div className='bottom-header'>
          <p className='link-styles' style={{ fontWeight: 'bolder', marginRight: 'auto' }}>Welcome User</p>
          <p className='link-styles'>Notifications</p>
          <p className='link-styles' onClick={()=>history("/")}>Logout</p>
        </div>
      </div>

      {/* Dashboard Tape */}
      <div className='dashboard-page'>

        <div style={{margin:0}}>
          <h2>TA Sortlisted Jobs</h2>
          <DataTable columns={deadlinePassedColumns} data={deadlinePassedData}/>
        </div>
      </div>
    </div>
  );
};

export default TACommittee;

