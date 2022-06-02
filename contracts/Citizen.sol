// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract Citizen {
    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    struct TravelHistory {
        string country;
        uint256 date;
        string reason;
    }

    struct ListedCountry {
        string country;
        uint256 duration;
    }

    struct citizen {
        uint256 id;
        string passport_number;
        string name;
        string dob;
        string nationality;
        string last_known_location;
        string departure;
        string[] connecting_countries;
        string arrival;
        TravelHistory[] travel_history;
        ListedCountry[] blacklisted_countries;
        ListedCountry[] graylisted_countries;
    }

    mapping(uint256 => citizen) citizenHashMap;

    function getCitizen(uint256 id) public view returns (citizen memory) {
        require(citizenHashMap[id].id == id, "Citizen does not exist");
        return citizenHashMap[id];
    }

    function setCitizen(
        uint256 id,
        string memory pn,
        string memory nam,
        string memory dateOfBirth,
        string memory nation
    ) public {
        require(citizenHashMap[id].id != id, "Citizen already exists");
        citizenHashMap[id].id = id;
        citizenHashMap[id].passport_number = pn;
        citizenHashMap[id].name = nam;
        citizenHashMap[id].dob = dateOfBirth;
        citizenHashMap[id].nationality = nation;
        citizenHashMap[id].last_known_location = nation;
        citizenHashMap[id].departure = "";
        citizenHashMap[id].connecting_countries = [""];
        citizenHashMap[id].arrival = "";
        // citizenHashMap[id].travel_history.push();
        // citizenHashMap[id].travel_history[citizenHashMap[id].travel_history.length - 1].country = nation;
        // citizenHashMap[id].travel_history[citizenHashMap[id].travel_history.length - 1].date = block.timestamp;
        // citizenHashMap[id].travel_history[citizenHashMap[id].travel_history.length - 1].reason = "Nationality";
        citizenHashMap[id].travel_history.push(
            TravelHistory(nation, block.timestamp, "Nationality")
        );
    }

    function getLastKnownLocation(uint256 id)
        public
        view
        returns (string memory)
    {
        return getCitizen(id).last_known_location;
    }

    function setLastKnownLocation(
        uint256 id,
        string memory lkl,
        string memory reason
    ) internal {
        require(citizenHashMap[id].id == id, "Citizen does not exist");
        if (
            keccak256(abi.encodePacked(reason)) ==
            keccak256(abi.encodePacked(""))
        ) reason = "Reason not given";
        citizenHashMap[id].last_known_location = lkl;
        citizenHashMap[id].travel_history.push(
            TravelHistory(lkl, block.timestamp, reason)
        );
    }

    function getCitizenDeparture(uint256 id)
        public
        view
        returns (string memory)
    {
        return getCitizen(id).departure;
    }

    function setCitizenDeparture(uint256 id, string memory dep) internal {
        require(citizenHashMap[id].id == id, "Citizen does not exist");
        citizenHashMap[id].departure = dep;
    }

    function getCitizenConnectingCountries(uint256 id)
        public
        view
        returns (string[] memory)
    {
        return getCitizen(id).connecting_countries;
    }

    function setCitizenConnectingCountries(uint256 id, string[] memory cc)
        internal
    {
        require(citizenHashMap[id].id == id, "Citizen does not exist");
        citizenHashMap[id].connecting_countries = cc;
    }

    function getCitizenArrival(uint256 id) public view returns (string memory) {
        return getCitizen(id).arrival;
    }

    function setCitizenArrival(uint256 id, string memory ari) internal {
        require(citizenHashMap[id].id == id, "Citizen does not exist");
        citizenHashMap[id].arrival = ari;
    }

    function getCitizenList(uint256 id, uint8 list)
        public
        view
        returns (ListedCountry[] memory)
    {
        if (list == 1) return getCitizen(id).blacklisted_countries;
        else return getCitizen(id).graylisted_countries;
    }

    function setCitizenList(
        uint256 id,
        uint8 list,
        string memory country,
        uint256 duration
    ) public {
        require(citizenHashMap[id].id == id, "Citizen does not exist");
        if (list == 1)
            citizenHashMap[id].blacklisted_countries.push(
                ListedCountry(country, duration)
            );
        else
            citizenHashMap[id].graylisted_countries.push(
                ListedCountry(country, duration)
            );
    }
}
