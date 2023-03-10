import { Chip, Stack } from "@mui/material";
import { Box } from "@mui/system";
import HomeCard from "./HomeCard";
import { ListingCard } from "../common/ListingsList/ListingCard";
import { SimilarListingCard } from "../ListingPage/SimilarListingCard";
import PeopleIcon from "@mui/icons-material/People";
import { useApi } from "../../hooks/api.hook";
import { Listing } from "../../model/Listing";
import { User } from "../../model/User";
import { ListingDTO } from "../listings/ListingsPage";
import { Link } from "react-router-dom";
import UserSuggestions from "../UserPage/UserSuggestions";
import { useAuthContext } from "../../contexts/auth.context";
import { Typography } from "@mui/joy";

export const Home: React.FC = () => {
  const {
    result: topListings,
    loading,
    error,
  } = useApi<ListingDTO[]>(`/listing/toplistings`);

  const {
    result: topSkills,
  } = useApi<string[]>(`/skill/topskills`);

  const { isAuthenticated } = useAuthContext();

  const { result: active } = useApi<any>(`/user/authcount`);

  const { result: numberOfListings } = useApi<any>(`/listing/listingscount`);

  const { result: numberOfCompanies } = useApi<any>(`/company/companiescount`);

  const { result: newestListings } = useApi<ListingDTO[]>(
    `/listing/newestlistings`
  );

  const {user} = useAuthContext();

  const testArray = [
    {
      name: "Users",
      count: active,
      icon: 1,
      link: ``
    },
    {
      name: "Listings",
      count: numberOfListings,
      icon: 2,
      link: "listings"
    },
    {
      name: "Companies",
      count: numberOfCompanies,
      icon: 3,
      link: "companies"
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

  const popularLanguages = [
    {
      id: 1,
      name: "Python",
    },
    {
      id: 2,
      name: "C#",
    },
    {
      id: 3,
      name: "TypeScript",
    },
  ];

  return (
    <main className="">
      <div
        className="bg-gray-300 py-5 md:py-8 relative flex items-center"
        style={{ backgroundColor: "var(--secondary-main)" }}
      >
        <div className="flex flex-col mx-auto w-full">
          <div className="px-4 max-w-7xl mx-auto w-full relative">
            <div>
              <div className="max-w-xl mx-auto">
                <h1 className="max-w-md md:max-w-xl mx-auto text-xl md:text-4xl text-blue-800 font-bold mb-6 md:mb-12 text-center animate-pulse">
                  Unleash the full potential of your IT career
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAuthenticated() ? (
        <UserSuggestions></UserSuggestions>
      ) : (
        <Box className="p-5">
          <p style={{ color: "gray" }}>
            Register today to get personalized job listings*
          </p>
        </Box>
      )}

      <div
        className="max-w-5xl mx-auto py-6 md:my-12 relative px-4"
        style={{ backgroundColor: "var(--secondary-main)" }}
      >
        <div className="flex items-center justify-center">
          <div
            className="mx-auto md:w-auto md:flex md:items-center md:justify-center sm:grid-cols-2 md:flex-wrap grid grid-cols-1
             place-items-center place-content-center gap-4 md:gap-8"
          >
            {testArray.map((el) => {
              return (
                <HomeCard
                  name={el.name}
                  icon={el.icon}
                  count={el.count}
                  link={el.link}
                  key={el.name}
                />
              );
            })}
          </div>
        </div>
      </div>
      <section className="py-8 lg:py-12 px-4">
        <div className="max-w-7xl mx-auto flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-800 ">
            Most demanded skills this month
          </h2>
          <div
            className="mx-auto justify-between md:w-auto md:flex md:items-center md:justify-center md:flex-wrap grid grid-cols-2
              md:grid-cols-none place-items-center place-content-center gap-4 md:gap-8"
          >
            {topSkills && topSkills?.map((el,id) => {
              return (
                <>
                  <Chip key={id} label={el} size="medium" color="primary" />
                </>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-8 lg:py-12 px-4 ">
        <div className="max-w-7xl mx-auto flex justify-center flex-col">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-800 ">
            Featured listings
          </h2>
          <div className="relative max-w-7xl mx-auto md:flex md:gap-6 px-4 py-8">
            <div
              className="flex items-center justify-center"
              style={{ backgroundColor: "var(--secondary-main)" }}
            >
              <div className="grid gap-4 max-w-7xl px-4 py-8">
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                  {topListings != null ? (
                    topListings.map((listing) => {
                      return (
                        <SimilarListingCard
                          listing={listing}
                          divHeight={300}
                          key={listing.id}
                        />
                      );
                    })
                  ) : (
                    <>
                      <h2>In database we don't have any listing</h2>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 flex justify-center">
            <Link
              to="/listings"
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
            <div className="grid md:grid-cols-3 gap-4">
              {newestListings != null &&
                newestListings.map((item) => (
                  <Link to={`/listing/${item.id}`} key={item.id}>
                    <SimilarListingCard listing={item} divHeight={300} />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
