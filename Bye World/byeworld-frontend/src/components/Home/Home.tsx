import { Link, Stack } from "@mui/material";
import { Box } from "@mui/system";
import HomeCard from "./HomeCard";
import { ListingCard } from "../common/ListingsList/ListingCard";
import { SimilarListingCard } from "../ListingPage/SimilarListingCard";
import PeopleIcon from "@mui/icons-material/People";

export const Home: React.FC = () => {
  const testArray = [
    {
      name: "Users",
      count: 5,
      icon: 1,
    },
    {
      name: "Oglasi",
      count: 1500,
      icon: 2,
    },
  ];

  const testListings = [
    {
      id: 1,
      closingDate: new Date(Date.now()),
      description: "Ovo je primer opisa posla1",
      postingDate: new Date(Date.now()),
      requirements: [],
      title: "C# Senior Developer",
      city: undefined,
      company: undefined,
    },
    {
      id: 2,
      closingDate: new Date(Date.now()),
      description: "Ovo je primer opisa posla2",
      postingDate: new Date(Date.now()),
      requirements: [],
      title: "Java Senior Developer",
      city: undefined,
      company: undefined,
    },
    {
      id: 3,
      closingDate: new Date(Date.now()),
      description: "Ovo je primer opisa posla3",
      postingDate: new Date(Date.now()),
      requirements: [],
      title: "Python Senior Developer",
      city: undefined,
      company: undefined,
    },
    {
      id: 4,
      closingDate: new Date(Date.now()),
      description: "Ovo je primer opisa posla4",
      postingDate: new Date(Date.now()),
      requirements: [],
      title: "Python Senior Developer4",
      city: undefined,
      company: undefined,
    },
  ];

  return (
    <main className="">
      <div className="bg-gray-300 py-5 md:py-8 relative flex items-center" style={{backgroundColor:"#fdd835"}}>
        <div className="flex flex-col mx-auto w-full">
          <div className="px-4 max-w-7xl mx-auto w-full relative">
            <div>
              <div className="max-w-xl mx-auto">
                <h1 className="max-w-md md:max-w-xl mx-auto text-xl md:text-4xl text-blue-800 font-bold mb-6 md:mb-12 text-center" >
                  Largest website of jobs
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-6 md:my-12 relative px-4" style={{backgroundColor:"#fdd835"}}>
        <div className="flex items-center justify-center">
          <div
            className="mx-auto md:w-auto md:flex md:items-center md:justify-center md:flex-wrap grid grid-cols-2
              md:grid-cols-none place-items-center place-content-center gap-4 md:gap-8"
          >
            {testArray.map((el) => {
              return (
                <HomeCard name={el.name} icon={el.icon} count={el.count} />
              );
            })}
          </div>
        </div>
      </div>
      <section className="py-8 lg:py-12 px-4 ">
        <div className="max-w-7xl mx-auto flex justify-center flex-col">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-800 ">
            Featured listings
          </h2>
          <div className="relative max-w-7xl mx-auto md:flex md:gap-6 px-4 py-8">
            {/* <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 md:gap-6 max-w-7xl mx-auto px-4 py-8">
              {testListings.map(listing => {
                return (
                  <SimilarListingCard listing={listing} divHeight={325} divMaxWidth={400} divMinWidth={350} />
                )
              })}
            </div> */}
            <div className="flex items-center justify-center" style={{backgroundColor:"#fdd835"}}>
              <div className="grid gap-4 max-w-7xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-4">
                  {testListings.map((listing) => {
                    // console.log(listing);
                    return (
                      <SimilarListingCard
                        listing={listing}
                        divHeight={300}
                        divMaxWidth={400}
                        divMinWidth={350}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 flex justify-center">
            <Link
              href="/listings"
              className="border-2 border-blue-700 bg-blue-700 font-bold rounded-lg text-lg no-underline 
                  flex items-center justify-center w-4/5"
            >
              <p className="text-white ">All listings</p>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 space-y-16">
        <div className="relative max-w-7xl mx-auto space-y-8">
          <div className="space-y-4 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 self-start">
              Latest listings
            </h2>
            <p className="text-lg md:text-xl max-w-4xl opacity-50 self-start">
              Here we show listings that have been posted in the last 2 hours
            </p>
            <div>OVDE TREBA DA IDU NAJNOVIJE OBJAVE ZA OGLASE</div>
          </div>
        </div>
      </section>
    </main>
  );
};
