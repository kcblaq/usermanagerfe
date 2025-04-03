import { Settings, User } from 'lucide-react';

function Nav() {
  return (
    <nav className="w-full  p-4 lg:px-8 flex justify-between items-center border-b border-gray-300 bg-white">
      <div className="text-xl flex items-center gap-1"> <User />ApexUsers </div>
      <div className='p-2 rounded-full bg-gray-100'>
        <Settings className='text-gray-500' />
        </div>

      
    </nav>
  );
}
export default Nav;