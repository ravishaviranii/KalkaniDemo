

import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { toast } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner'

function App() {
  const [tableData, setTableData] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loader, setLoader] = useState(false)


  const getDataHandler = () => {
    setLoader(true)
    axios.get(`https://api.jikan.moe/v4/characters?page=${page}&limit=${15}&q=${search}`)
      .then((res) => {

        setTableData(res?.data?.data)
        setTotal(res?.data?.pagination?.items?.total)
        setLoader(false)
      }).catch((err) => {
        setLoader(false)
        toast.error("Something went wrong !")
      });
  }

  useEffect(() => {
    getDataHandler()
  }, [search, page])
  return (
    <>



      <div className='search_anime'>
        <h1>Search Anime characters</h1>

        <div className='search'>
          <input type='text' onChange={(e) => setSearch(e.target.value)} placeholder='Search..' />

          <CiSearch />


        </div>
        <p className='anime_total'>Total <b>{total}</b> matching anime characters found</p>
      </div>


      <div className='body_content'>
        {
          loader ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <RotatingLines
                visible={true}
                height={96}
                width={96}
                strokeWidth={5}
                animationDuration={0.75}
                ariaLabel="rotating-lines-loading"

              />
            </div>
            :
            tableData.length == 0 ?
              <div className='not_found'>
                <h2>No data found !!</h2>
              </div>
              :

              tableData.map((el, i) => {

                return (
                  <div key={i}>
                    <div className='card' >

                      <div className='show_name'>
                        <img className='anime_logo' src={el?.images?.jpg?.image_url} alt='Anime logo' />
                        <div>
                          <h5>{el.name}</h5>
                          <div className='nicknames'>
                            {
                              el?.nicknames.map((item, index) => {
                                return (
                                  <p key={index}>
                                    {item}
                                  </p>
                                )
                              })
                            }

                          </div>
                        </div>
                      </div>


                      <div className='main_like'>

                        <div className='like'>
                          <FaHeart className='heart' /><p>{el.favorites}</p>
                        </div>
                        <div className='detail_page' onClick={() => window.open(el.url, "_blank")}>
                          <FaArrowRight />
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })

        }




      </div>
      <div className='pagination'>

        <button className={page == 1 ? 'disabled btn' : 'btn'} disabled={page == 1} onClick={() => setPage(page - 1)}>Prev</button>
        <button className='btn' onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </>


  );
}

export default App;
