export default function Footer({statusText}) {
/* e8e0de */
/* 0077B3 */
    return (
      <footer className="bg-custom-beige w-full h-20 flex text-lg sm:px-0 items-center">
          <div className="ml-5 ">
              {statusText}
              </div>
      </footer>
    );
  }

  /*
  export default function Footer() {

return (
  <footer className="bg-[#e8e0de] w-full h-20 flex text-lg pr-5 sm:px-0 items-center justify-end sm:justify-center">
        © 2024 EDA Clinical
  </footer>
);
}
*/