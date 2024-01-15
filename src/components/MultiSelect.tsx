import { useEffect, useMemo, useRef, useState } from "react";
import { UserFormatedData } from "../types";

interface MultiSelectProps {
  options: UserFormatedData[];
}

/**
 * This component is for selecting and displaying multiple users.
 */

const MultiSelect = ({ options }: MultiSelectProps): JSX.Element => {
  const [selectedData, setSelectedData] = useState<UserFormatedData[]>([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const multiSelectRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const userData = useMemo(() => options, [options]);

  // Function to handle click outside the multiSelect div
  const handleClickOutside = (e: any) => {
    if (multiSelectRef.current && !multiSelectRef.current.contains(e.target)) {
      setIsInputFocused(false);
    }
  };

  const setInputFocused = () => setIsInputFocused(true);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized filtered user data based on search term and selected users
  const userFilteredData = useMemo(
    () =>
      userData.filter(
        (userData) =>
          selectedData.findIndex(
            (selectedUser) => selectedUser.id === userData.id
          ) < 0 &&
          userData.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [selectedData, userData, searchTerm]
  );

  // Function to add a user
  const addUserToList = (user: UserFormatedData) => {
    setSelectedData((data) => [...data, user]);
    setSearchTerm("");
  };

  // Function to remove a user from the selected list
  const removeUserFromList = (id: string) => {
    setSelectedData((data) => data.filter((user) => user.id !== id));
  };
  return (
    <div
      ref={multiSelectRef}
      className="w-full border-b border-b-blue-400 my-2 gap-1 relative p-2 flex flex-row items-center"
    >
      <div className="flex flex-row flex-wrap item-center gap-2 max-w-1/2">
        {selectedData.map((userData) => (
          <div
            key={userData.id}
            className="flex flex-row gap-2 px-2 py-1 bg-gray-200 items-center rounded-full"
          >
            <div>
              <img
                src={userData.image}
                alt={userData.name}
                className="rounded-full h-6"
              />
            </div>
            <div className="font-medium text-sm">{userData.name}</div>
            <div
              className="p-1 cursor-pointer"
              onClick={() => removeUserFromList(userData.id)}
            >
              &#10005;
            </div>
          </div>
        ))}
      </div>
      <input
        onFocus={setInputFocused}
        placeholder={selectedData.length === 0 ? "Search Here..." : ""}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 min-w-1/2 min-h-max flex-1 py-2 outline-none focus:outline-none border-none"
      />
      {isInputFocused && (
        <div className="absolute shadow-lg flex z-20 w-full flex-col left-0 top-[calc(100%)]">
          {userFilteredData.map((user) => (
            <div
              className="flex flex-row gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100  items-center"
              key={user.id}
              onClick={() => addUserToList(user)}
            >
              <div>
                <img
                  src={user.image}
                  alt={user.name}
                  className="rounded-full h-8"
                />
              </div>
              <div className="font-semibold">{user.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
