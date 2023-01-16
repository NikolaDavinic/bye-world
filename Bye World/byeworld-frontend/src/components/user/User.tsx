import React from "react";
import { Button } from "@mui/material";
import Link from "@mui/material/Link";
import { UserSkillsModal } from "../UserSkillsModal/UserSkillsModal";

export default function User() {
  const onButtonSettings = () => {
    console.log("Clicked on button settings!");
  };
  const [open, setOpen] = React.useState(false);
  const handleModalClose = () => {
    setOpen(false);
  }
  const handleModalOpen = () => {
    setOpen(true);
  }

  return (
    <main className="flex-1">
      <UserSkillsModal isOpen={open} handleModalClose={handleModalClose} />

      <div className="bg-gradient-to-r from-blue-900 to-green-500 relative">
        <div className="hidden md:flex justify-end absolute right-0 inset-y-0 opacity-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 99 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-auto"
          >
            <path d="M47 0H23L0 36H24L47 0Z" fill="white"></path>
            <path
              d="M99 0H75L63.5 18L75 36H99L87.5 18L99 0Z"
              fill="url(#paint0_linear_34:129)"
            ></path>
            <path
              d="M54.75 9L49 18L54.75 27H60.75L55 18L60.75 9H54.75Z"
              fill="#00EA49"
            ></path>
            <path
              d="M29.503 18L23.753 27L29.503 36H35.503L29.753 27L35.503 18H29.503Z"
              fill="#00EA49"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_34:129"
                x1="140.482"
                y1="70.6211"
                x2="79.1462"
                y2="-12.7783"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#00EA49"></stop>
                <stop offset="0.49" stop-color="#00EA49"></stop>
                <stop offset="1" stop-color="#00FFD9"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-16 w-full">
          <div
            className="flex items-center gap-1 overflow-auto pb-4 scrollbar-thin 
                scrollbar-thumb-white scrollbar-track-transparent scrollbar-thumb-rounded-full 
                scrollbar-track-rounded-full"
          >
            <Link href="/user/2" color="inherit">
              <a
                className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800 bg-white text-blue-800"
                data-section="profil"
              >
                Moj nalog
              </a>
            </Link>
            <Button variant="outlined" onClick={() => handleModalOpen()} >Edit Skills</Button>
            <a
              href="/moj-nalog/prijave"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="prijave"
            >
              Moje prijave
            </a>
            <a
              href="/moj-nalog/sacuvani-oglasi"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="sacuvani-oglasi"
            >
              Sačuvani oglasi
            </a>
            <a
              href="/moj-nalog/kompanije"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="kompanije"
            >
              Kompanije
            </a>
            <a
              href="/moj-nalog/moja-iskustva"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="recenzije"
            >
              Moja iskustva
            </a>
            <a
              href="/moj-nalog/dokumenti"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="dokumenti"
            >
              Moji dokumenti
            </a>
            <a
              href="/moj-nalog/mejling-liste"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="mejling-liste"
            >
              Mejling liste
            </a>
            <a
              href="/moj-nalog/alttab"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="alttab"
            >
              altTab
            </a>
            <a
              href="/moj-nalog/podesavanja"
              className="text-sm font-medium shrink-0 flex px-2 py-2 rounded leading-none __user-nav-item         text-white hover:bg-white hover:text-blue-800"
              data-section="podesavanja"
            >
              Podešavanja
            </a>

            <script type="text/javascript">
              {/* var userNavigationActiveclassName = 'bg-white  text-blue-800 dark:text-white dark:hover:opacity-100'; */}
              {/* var userNavigationInactiveclassName = 'text-white hover:bg-white hover:text-blue-800 dark:hover:text-white'; */}
            </script>
          </div>{" "}
        </div>
      </div>
      <div
        className="relative max-w-5xl mx-auto flex flex-col gap-8 px-4 -mt-12 mb-8
    w-full __section bg-gradient-to-r from-green-500 to-blue-900 relative"
      >
        {/* <script src="https://www.helloworld.rs/public/js/plugins/pdfjs/build/pdf.js" type="text/javascript"></script> */}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-wrap gap-4 items-center justify-between p-8">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className="bg-blue-800 text-white w-20 h-20 flex items-center justify-center text-center rounded-full text-lg font-semibold">
                  HW
                </span>
              </div>
              <div className="space-y-1 md:space-y-0">
                <p className="opacity-60 font-medium">
                  It's nice to see you on ByeWorld!
                </p>
                <p className="font-bold text-2xl"> </p>
                <p className="opacity-60 font-medium">
                  OVDE TREBA EMAIL KORISNIKA
                </p>
              </div>
            </div>

            <a href="/moj-nalog/podesavanja" className="btn btn-outline btn-md">
              <Button className="text outlined">Podešavanja</Button>
            </a>
          </div>

          <div
            className="grid grid-cols-3 md:divide-x 
        md:divide-gray-200 md:divide-solid border-t md:border-gray-200"
          >
            <a
              href="/moj-nalog/sacuvani-oglasi"
              className="flex flex-wrap items-center justify-center gap-2 p-4 font-medium bg-gray-100  
        hover:opacity-75"
            >
              <span className="text-sm hidden md:inline-block">
                Sačuvani oglasi
              </span>
              <i className="las la-heart text-2xl md:hidden"></i>
              <span
                className="text-xs rounded-full w-6 h-6 flex items-center justify-center bg-black/60 text-white 
"
              >
                0
              </span>
            </a>
            <a
              href="/moj-nalog/kompanije"
              className="flex flex-wrap items-center justify-center gap-2 p-4 font-medium bg-gray-100  
        hover:opacity-75"
            >
              <span className="text-sm hidden md:inline-block">Kompanije</span>
              <i className="las la-building text-2xl md:hidden"></i>
              <span
                className="text-xs rounded-full w-6 h-6 flex items-center justify-center bg-black/60 text-white 
"
              >
                0
              </span>
            </a>
            <a
              href="/moj-nalog/chat"
              className="flex flex-wrap items-center justify-center gap-2 p-4 font-medium bg-gray-100  
        hover:opacity-75"
            >
              <span className="text-sm hidden md:inline-block">Čet</span>
              <i className="las la-comments text-2xl md:hidden"></i>
              <span
                className="text-xs rounded-full w-6 h-6 flex items-center justify-center bg-black/60 text-white 
"
              >
                0
              </span>
            </a>
          </div>
        </div>

        <div>
          <div className="grid md:grid-cols-3 bg-white  rounded-lg md:shadow-sm overflow-hidden">
            <a
              href="/moj-nalog/prijave"
              className="relative flex flex-col gap-2 hover:opacity-75 p-8 border border-gray-100"
            >
              <i className="las la-hand-pointer text-2xl opacity-50"></i>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Moje prijave</p>
                <p className="text-sm opacity-50">
                  Sve prijave na oglase, aktivni i istekli konkursi
                </p>
              </div>
              <div
                className="absolute top-4 right-4  rotate-45 flex items-center 
            justify-center 
            w-10 
            h-10 rounded-full opacity-25"
              >
                <i className="las la-arrow-up text-3xl"></i>
              </div>
            </a>
            <a
              href="/moj-nalog/sacuvani-oglasi"
              className="relative flex flex-col gap-2 hover:opacity-75 p-8 border border-gray-100"
            >
              <i className="las la-heart text-2xl opacity-50"></i>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Sačuvani oglasi</p>
                <p className="text-sm opacity-50">
                  Sačuvaj oglase koje su ti zanimljivi, apliciraj kasnije
                </p>
              </div>
              <div
                className="absolute top-4 right-4  rotate-45 flex items-center 
            justify-center 
            w-10 
            h-10 rounded-full opacity-25"
              >
                <i className="las la-arrow-up text-3xl"></i>
              </div>
            </a>
            <a
              href="/moj-nalog/kompanije"
              className="relative flex flex-col gap-2 hover:opacity-75 p-8 border border-gray-100"
            >
              <i className="las la-building text-2xl opacity-50"></i>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Kompanije</p>
                <p className="text-sm opacity-50">
                  Prateći kompanije neće ti promaći nijedna informacija o
                  poslodavcu
                </p>
              </div>
              <div
                className="absolute top-4 right-4  rotate-45 flex items-center 
            justify-center 
            w-10 
            h-10 rounded-full opacity-25"
              >
                <i className="las la-arrow-up text-3xl"></i>
              </div>
            </a>
            <a
              href="/moj-nalog/moja-iskustva"
              className="relative flex flex-col gap-2 hover:opacity-75 p-8 border border-gray-100"
            >
              <i className="las la-pen-nib text-2xl opacity-50"></i>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Moja iskustva</p>
                <p className="text-sm opacity-50">
                  Tvoje objavljene i nedovršene recenzije i plate
                </p>
              </div>
              <div
                className="absolute top-4 right-4  rotate-45 flex items-center 
            justify-center 
            w-10 
            h-10 rounded-full opacity-25"
              >
                <i className="las la-arrow-up text-3xl"></i>
              </div>
            </a>
            <a
              href="/moj-nalog/dokumenti"
              className="relative flex flex-col gap-2 hover:opacity-75 p-8 border border-gray-100"
            >
              <i className="las la-cloud text-2xl opacity-50"></i>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Moji dokumenti</p>
                <p className="text-sm opacity-50">
                  Sačuvaj dokumenta pomoću kojih ćeš lako konkurisati
                </p>
              </div>
              <div
                className="absolute top-4 right-4  rotate-45 flex items-center 
            justify-center 
            w-10 
            h-10 rounded-full opacity-25"
              >
                <i className="las la-arrow-up text-3xl"></i>
              </div>
            </a>
            <a
              href="/moj-nalog/mejling-liste"
              className="relative flex flex-col gap-2 hover:opacity-75 p-8 border border-gray-100"
            >
              <i className="las la-mail-bulk text-2xl opacity-50"></i>
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Mejling liste</p>
                <p className="text-sm opacity-50">
                  Izaberi kriterijume mejling liste po tvojoj meri
                </p>
              </div>
              <div
                className="absolute top-4 right-4  rotate-45 flex items-center 
            justify-center 
            w-10 
            h-10 rounded-full opacity-25"
              >
                <i className="las la-arrow-up text-3xl"></i>
              </div>
            </a>
          </div>
        </div>

        <div
          id="preview-pdf-modal"
          className="hidden fixed inset-0 z-80 overflow-y-auto __modal "
          data-modal="preview-pdf-modal"
        >
          <div className="fixed inset-0 bg-black/80 __modal-backdrop"></div>
          <div className="flex items-end justify-center min-h-screen px-4">
            <div className="w-full max-w-3xl relative mx-auto my-auto rounded-xl shadow-lg bg-white ">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-800 to-blue-600 p-4 rounded-t-lg">
                <p className="font-bold md:text-lg mr-8 md:mr-0 text-white">
                  Pregled dokumenta
                </p>

                <button
                  className="btn-icon btn-icon-primary btn-icon-sm absolute top-3 right-4"
                  data-dismiss-modal="preview-pdf-modal"
                >
                  <i className="las la-times text-xl "></i>
                </button>
              </div>

              <div className="mt-3 mb-3">
                <button
                  id="prev"
                  type="button"
                  className="btn btn-primary btn-sm inline-block ml-3 mr-3 w-auto  "
                >
                  <span>&lt;&lt; </span>
                </button>

                <span className="inline-block mr-3">
                  Strana: <span id="page_num"></span> /{" "}
                  <span id="page_count"></span>
                </span>

                <button
                  id="next"
                  type="button"
                  className="btn btn-primary btn-sm inline-block mr-3 w-auto  "
                >
                  <span>&gt;&gt; </span>
                </button>

                <button
                  id="preview_downloader"
                  type="button"
                  className="btn btn-primary btn-sm inline-block w-auto mr-3 ml-3 md:ml-0 mt-3  "
                >
                  <span>Preuzmi </span>
                </button>
              </div>
              {/* ovde sam skinuo style style="max-width: calc(90vw)" */}
              <div className="__preview-pdf-body h-72 overflow-y-scroll md:h-auto md:overflow-auto">
                <div id="the-container">
                  <canvas id="the-canvas"></canvas>
                </div>
              </div>

              <div className="flex items-center justify-center bg-gray-200 p-4">
                <button
                  type="button"
                  className="btn btn-primary btn-md  "
                  data-dismiss-modal="preview-pdf-modal"
                >
                  <span>Zatvori </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          id="remove-review-modal"
          className="hidden fixed inset-0 z-80 overflow-y-auto __modal __remove-review-modal"
          data-modal="remove-review-modal"
        >
          <div className="fixed inset-0 bg-black/80 __modal-backdrop"></div>
          <div className="flex items-end justify-center min-h-screen px-4">
            <div className="w-full max-w-lg relative mx-auto my-auto rounded-xl shadow-lg bg-white ">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-800 to-blue-600 p-4 rounded-t-lg">
                <p className="font-bold md:text-lg mr-8 md:mr-0 text-white">
                  Potvrdi brisanje
                </p>

                <button
                  className="btn-icon btn-icon-primary btn-icon-sm absolute top-3 right-4"
                  data-dismiss-modal="remove-review-modal"
                >
                  <i className="las la-times text-xl "></i>
                </button>
              </div>

              <div className="text-center p-4 flex-auto justify-center">
                <p className="text-sm opacity-50 px-8 __modal-desc">
                  Da li si siguran?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mb-4">
                <button
                  type="button"
                  className="btn btn-primary btn-md __remove-review-confirm  "
                >
                  <span>Obriši </span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-md  "
                  data-dismiss-modal="remove-review-modal"
                >
                  <span>Odustani </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="deactivate-account-modal"
        className="hidden fixed inset-0 z-80 overflow-y-auto __modal __selector-className"
        data-modal="deactivate-account-modal"
      >
        <div className="fixed inset-0 bg-black/80 __modal-backdrop"></div>
        <div className="flex items-end justify-center min-h-screen px-4">
          <div className="w-full max-w-lg relative mx-auto my-auto rounded-xl shadow-lg bg-white">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-800 to-blue-600 p-4 rounded-t-lg">
              <p className="font-bold md:text-lg mr-8 md:mr-0 text-white">
                Deaktivacija naloga
              </p>

              <button
                className="btn-icon btn-icon-primary btn-icon-sm absolute top-3 right-4"
                data-dismiss-modal="deactivate-account-modal"
              >
                <i className="las la-times text-xl "></i>
              </button>
            </div>

            <div className="text-center p-4 flex-auto justify-center">
              <p className="text-sm opacity-50 px-8 __modal-desc">
                Siguran si da želiš da deaktiviraš nalog?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mb-4">
              <button
                type="button"
                className="btn btn-primary btn-md __deactivate-account  "
              >
                <span>Deaktiviraj </span>
              </button>

              <button
                type="button"
                className="btn btn-outline btn-md  "
                data-dismiss-modal="deactivate-account-modal"
              >
                <span>Odustani </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="deactivate-done-modal"
        className="hidden fixed inset-0 z-80 overflow-y-auto __modal __selector-className"
        data-modal="deactivate-done-modal"
      >
        <div className="fixed inset-0 bg-black/80 __modal-backdrop"></div>
        <div className="flex items-end justify-center min-h-screen px-4">
          <div className="w-full max-w-lg relative mx-auto my-auto rounded-xl shadow-lg bg-white">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-800 to-blue-600 p-4 rounded-t-lg">
              <p className="font-bold md:text-lg mr-8 md:mr-0 text-white">
                Deaktivacija
              </p>

              <button
                className="btn-icon btn-icon-primary btn-icon-sm absolute top-3 right-4"
                data-dismiss-modal="deactivate-done-modal"
              >
                <i className="las la-times text-xl "></i>
              </button>
            </div>

            <div className="text-center p-4 flex-auto justify-center">
              <p className="text-sm opacity-50 px-8 __modal-desc">
                Tvoj nalog je uspešno deaktiviran
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mb-4"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
