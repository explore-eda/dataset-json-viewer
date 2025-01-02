const PageInput = ({tab, setPage}) => {

  const handleClick = (page) => {
    setPage(tab.tabID, page);
  }

  console.log("tab", tab);

  if (tab?.totalPages >= 0 && Number.isInteger(tab?.totalPages)) {
    return (
      <div>
        {[...Array(tab?.totalPages)].map((_, i) => (
          <button 
              key={i} 
              onClick={() => handleClick(i)} 
              className={`px-3 py-1 rounded-md ${i === tab?.page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
            >
              {i}
            </button>        ))}
      </div>
    );
  } else {
    return null; 
  }
};

export default PageInput;