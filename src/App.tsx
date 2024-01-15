import { useCallback, useEffect, useState } from "react";
import MultiSelect from "./components/common/MultiSelect";
import { UserFormatedData } from "./types";
import UserData from "./types/user";

function App() {
  const [userData, setUserData] = useState<UserFormatedData[]>([]);

  /** Function to fetch random user data. */
  const getRandomUsers = useCallback(
    async (signal: AbortSignal): Promise<UserData[]> => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(
            `https://randomuser.me/api/?results=10`,
            {
              signal,
            }
          );
          const data = await response.json();
          resolve(data.results);
        } catch (err) {
          reject(err);
        }
      });
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    getRandomUsers(controller.signal)
      .then((data: UserData[]) => {
        const users: UserFormatedData[] = data.map((user: UserData) => ({
          id:
            user.id.value ??
            parseInt((Math.random() * 1000000).toFixed(2)).toString(),
          name: `${user.name.title} ${user.name.first} ${user.name.last}`,
          image: user.picture.thumbnail,
        }));
        setUserData(users);
      })
      .catch((err) => console.log(err));

    // Cleanup: Abort the fetch request if the component is unmounted
    return () => controller.abort();
  }, [getRandomUsers]);

  return (
    <div className="flex w-full justify-center">
      <form className="flex flex-col items-center w-1/2 gap-2 mt-10">
        <MultiSelect options={userData} />
      </form>
    </div>
  );
}

export default App;
