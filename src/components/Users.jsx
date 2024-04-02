import { useEffect, useState } from "react"
import Card from './Card'
import ReactPaginate from 'react-paginate';
import axios from "axios";
import queryString from 'query-string';
import { useSelector } from "react-redux";
import { addUser, removeUser, setUser, clearUsers } from "../state";
import { store } from "../store";
import { useNavigate } from "react-router-dom";

function Items({ currentItems }) {
    const Navigate = useNavigate();
    const selectedUsersFromStore = useSelector((state) => state.savedUsers);
    const [selectedUsers, setSelectedUsers] = useState([]); // Initialize with data from Redux store

    useEffect(() => {
        setSelectedUsers(selectedUsersFromStore);
        console.log('Selected users from store:',selectedUsersFromStore);
    }, []);

    useEffect(() => {
        console.log('Selected users:',selectedUsers);
    }, [selectedUsers]);
    
    const checkValid=(userIds)=>{
        const users= currentItems.filter(user=>userIds.includes(user._id));
        console.log(users);
        const domainByAvailability = [];
        users.forEach(user=>domainByAvailability.push(user.domain+(user.available?'true':'false')));
        console.log(domainByAvailability);
        const domainSet = new Set(domainByAvailability);
        console.log(domainSet);
        if(domainSet.size!==domainByAvailability.length){
            return false;
        }
        else{
            return true;
        }


    }
    const createTeam = () => {
        axios.post('team', { users: selectedUsers }).then((response) => {
            console.log(response.data);
            alert('Team created successfully');
            store.dispatch(clearUsers());
            Navigate('/team/'+response.data._id)
        }).catch((error) => {
            console.log(error);
            alert('Error creating team');
        });
    }

    return (<>
        
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-11/12  p-0 mx-auto">
            {currentItems.map((user) => (
                <Card key={user._id} user={user} 
                selected={
                    selectedUsers.filter(selectedUser=>selectedUser===user._id).length>0?true:false
                }
                handleSelect={()=>{
                    if(checkValid([...selectedUsers,user._id])){
                    setSelectedUsers([...selectedUsers,user._id]);
                    store.dispatch(addUser(user._id));
                    }else{
                        alert('Conflicting availability for domain');
                    }
                }
                }
                handleRemove={()=>{
                    setSelectedUsers(selectedUsers.filter(selectedUser=>selectedUser!==user._id));
                    store.dispatch(removeUser(user._id));
                }
                }
                 />
            ))}
        </div>
        <h1 className="text-center text-3xl font-bold m-4">Selected Users : {selectedUsers.length}</h1>

        <div className="grid place-items-center gap-2 w-fit mx-auto md:grid-cols-2">
        <button onClick={() => {
            setSelectedUsers([]);
            store.dispatch(setUser([]));
        }}
        className="bg-red-500 flex justify-center mx-auto m-4  text-white p-2 rounded-lg"
        >Remove All Users</button>

        <button
        onClick={createTeam}
        className="bg-green-500 flex justify-center mx-auto m-4 text-white p-2 rounded-lg"
        >Create Team</button>
        </div>
        </>);
}

function PaginatedItems({ itemsPerPage }) {
    const [itemOffset, setItemOffset] = useState(0);
    const [items, setItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [filters, setFilters] = useState({});
    const [genderSet, setGenderSet] = useState(new Set);
    const [domainSet, setDomainSet] = useState(new Set);
    const [availabilitySet, setAvailabilitySet] = useState(new Set);
    const [searchValue, setSearchValue] = useState('');
    
    useEffect(() => {
        axios.get('filters').then((response) => {
            setGenderSet(new Set(response.data.genders));
            setDomainSet(new Set(response.data.domains));
            setAvailabilitySet(new Set(['true','false']));
        }
        ).catch((error) => {
            console.log(error);
        });

        axios.get('users').then((response) => {
            setItems(response.data.users);
            setPageCount(Math.ceil(response.data.totalUsers/itemsPerPage));
            setItemCount(response.data.totalUsers);
        } ).catch((error) => {
            console.log(error);
        });



    }, []);

    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = items?items:[];

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const filtersQueryString = queryString.stringify(filters);
        axios.get(`users?search=${searchValue}&page=${event.selected+1}&${filtersQueryString}`).then((response) => {
            setItems(response.data.users);
            setPageCount(Math.ceil(response.data.totalUsers/itemsPerPage));
            setItemCount(response.data.totalUsers);
        } ).catch((error) => {
            console.log(error);
        });
        const newOffset = (event.selected * itemsPerPage);
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    useEffect(() => {
        const handleSearch = setTimeout(() =>{
            console.log(`Searching for ${searchValue}`);
            if (searchValue === '') {
            const filtersQueryString = queryString.stringify(filters);
            axios.get(`users?${filtersQueryString}`).then((response) => {
            setItems(response.data.users);
            setItemCount(response.data.totalUsers);
            setPageCount(Math.ceil(response.data.totalUsers/itemsPerPage));
        } ).catch((error) => {
            console.log(error);
        });
            return;
        }
        const filtersQueryString = queryString.stringify(filters);
        axios.get(`users?search=${searchValue}&${filtersQueryString}`).then((response) => {
            setItems(response.data.users);
            setPageCount(Math.ceil(response.data.totalUsers/itemsPerPage));
            setItemCount(response.data.totalUsers);
        } ).catch((error) => {
            console.log(error);
        });
    }, 1000);
    return () => clearTimeout(handleSearch);
}, [searchValue,filters]);

    return (
        <>
            <input type="text" placeholder="Search" value={searchValue} className="flex w-10/12 lg:w-4/12 p-2 mx-auto my-4" 
                onChange={(event) => {
                    event.preventDefault();
                    setSearchValue(event.target.value);
                }}

            />
            <div className="flex flex-wrap justify-center gap-4 [&>*]:p-2 [&>*]:my-auto p-8">
                <div className="flex">
                <label className="py-2 px-2">Gender</label>
                <select
                    onChange={(event) => {
                        event.preventDefault();
                        if (event.target.value === 'All') {
                            const newFilters = { ...filters };
                            delete newFilters['gender'];
                            setFilters(newFilters);
                            return;
                        }
                        setFilters({ ...filters,gender: event.target.value });
                    }}
                    className="p-2 rounded"
                >
                    <option value="All">All</option>
                    {Array.from(genderSet || []).map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                </div>

                <div className="flex">
                <label className="py-2 px-2">Domain</label>
                <select onChange={(event) => {
                    event.preventDefault();
                    if (event.target.value === 'All') {
                        const newFilters = { ...filters };
                        delete newFilters['domain'];
                        setFilters(newFilters);
                        return;
                    }
                    setFilters({ ...filters, domain: event.target.value });
                }}
                className="p-2 rounded"
                >
                    <option value="All">All</option>
                    {Array.from(domainSet || []).map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                </div>

                <div className="flex">
                <label className="py-2 px-2">Available</label>
                <select onChange={(event) => {
                    event.preventDefault();
                    if (event.target.value === 'All') {
                        const newFilters = { ...filters };
                        delete newFilters['available'];
                        setFilters(newFilters);
                        return;
                    }
                    setFilters({ ...filters, available: event.target.value==='true'?true:false });
                }}
                className="p-2 rounded"
                >
                    <option value="All">All</option>
                    {Array.from(availabilitySet || []).map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                </div>
                
                <button onClick={(e) => {
                    e.preventDefault();
                    setFilters({});
                    const selects = document.querySelectorAll('select');
                    for (let select of selects) {
                        select.value = 'All';
                    }
                    setSearchValue('');
                }
                }
                className="bg-red-500 text-white p-2 rounded-lg"
                >Clear Filters</button>
                

            </div>
            <Items currentItems={items||[]} />
            <p className="text-center mt-4">
                Showing {itemOffset + 1} to {Math.min(endOffset,itemCount)} of {itemCount} users
            </p>
            <ReactPaginate
                className="flex mt-4 justify-center [&>*]:px-2"
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
            />
        </>
    );
}

export default PaginatedItems