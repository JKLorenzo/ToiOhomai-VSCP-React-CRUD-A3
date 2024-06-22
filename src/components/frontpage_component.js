import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetInfo } from '../firebase/firestore';

export default function FRONTPAGE_COMPONENT() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await GetInfo();
      setMenuItems(data);
    };
    getData()
  }, []);

  return (
    <div>
      <h1>Welcome to the CRUD Application</h1>
      <nav>
        {
          menuItems.map(menu_item => (
            <>
              <Link key={menu_item.id} to={`/document/${menu_item.id}`}>{menu_item.name}</Link>
              {' '}
            </>
          ))
        }
        <Link to='/CRUD'>CRUD Functions</Link>
      </nav>
    </div>
  );
}

