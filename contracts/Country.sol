// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./Citizen.sol";

contract Country is Citizen {
    struct ListedCountry {
        string country_name;
        uint256 duration;
    }

    struct country {
        string country_name;
        ListedCountry[] blacklisted_countries;
        ListedCountry[] graylisted_countries;
        ListedCountry[] whitelisted_countries;
    }

    mapping(string => country) countryHashMap;

    function getCountry(string memory country_name)
        public
        view
        returns (country memory)
    {
        require(
            keccak256(
                abi.encodePacked(countryHashMap[country_name].country_name)
            ) == keccak256(abi.encodePacked(country_name)),
            "This country does not exist"
        );
        return countryHashMap[country_name];
    }

    function setCountry(string memory cn) public {
        countryHashMap[cn].country_name = cn;
        countryHashMap[cn].blacklisted_countries = [ListedCountry("", 0)];
        countryHashMap[cn].graylisted_countries = [ListedCountry("", 0)];
        countryHashMap[cn].whitelisted_countries = [ListedCountry("", 0)];
    }

    function list_country(
        string memory main_country_name,
        string memory list_country_name,
        uint256 duration,
        uint8 list
    ) public {
        require(
            keccak256(
                abi.encodePacked(countryHashMap[main_country_name].country_name)
            ) == keccak256(abi.encodePacked(main_country_name)),
            "This country does not exist"
        );
        if (list == 1)
            countryHashMap[main_country_name].blacklisted_countries.push(
                ListedCountry(list_country_name, duration)
            );
        else if (list == 2)
            countryHashMap[main_country_name].graylisted_countries.push(
                ListedCountry(list_country_name, duration)
            );
        else if (list == 3)
            countryHashMap[main_country_name].whitelisted_countries.push(
                ListedCountry(list_country_name, duration)
            );
    }

    function checkListCountry(uint256 citizen_id)
        public
        view
        returns (bool, uint256)
    {
        string memory citizen_dep = Citizen.getCitizenDeparture(citizen_id);
        string memory citizen_ari = Citizen.getCitizenArrival(citizen_id);
        string[] memory citizen_cc = Citizen.getCitizenConnectingCountries(
            citizen_id
        );

        // connecting countries
        for (uint256 a = 0; a < 2; a++) {
            ListedCountry[] memory cntry_b;
            for (uint256 index = 0; index < citizen_cc.length; index++) {
                if (a == 0)
                    cntry_b = countryHashMap[citizen_cc[index]]
                        .blacklisted_countries;
                else if (a == 1)
                    cntry_b = countryHashMap[citizen_cc[index]]
                        .graylisted_countries;

                for (uint256 i = 0; i < cntry_b.length; i++) {
                    if (
                        keccak256(abi.encodePacked(cntry_b[i].country_name)) ==
                        keccak256(abi.encodePacked(citizen_dep))
                    ) return (false, a);
                }
            }
        }

        // arrival country
        for (uint256 a = 0; a < 2; a++) {
            ListedCountry[] memory cntry_b;
            if (a == 0)
                cntry_b = countryHashMap[citizen_ari].blacklisted_countries;
            else if (a == 1)
                cntry_b = countryHashMap[citizen_ari].graylisted_countries;

            for (uint256 i = 0; i < cntry_b.length; i++) {
                if (
                    keccak256(abi.encodePacked(cntry_b[i].country_name)) ==
                    keccak256(abi.encodePacked(citizen_dep))
                ) return (false, a);
            }
        }

        return (true, 0);
    }

    function checkListCitizen(uint256 citizen_id)
        public
        view
        returns (bool, uint256)
    {
        string memory citizen_ari = Citizen.getCitizenArrival(citizen_id);
        string[] memory citizen_cc = Citizen.getCitizenConnectingCountries(
            citizen_id
        );

        // connecting countries
        for (uint256 a = 0; a < 2; a++) {
            Citizen.ListedCountry[] memory cntry_b;
            for (uint256 index = 0; index < citizen_cc.length; index++) {
                if (a == 0) cntry_b = Citizen.getCitizenList(citizen_id, 1);
                else if (a == 1)
                    cntry_b = Citizen.getCitizenList(citizen_id, 2);

                for (uint256 i = 0; i < cntry_b.length; i++) {
                    if (
                        keccak256(abi.encodePacked(cntry_b[i].country)) ==
                        keccak256(abi.encodePacked(citizen_cc[index]))
                    ) return (false, a);
                }
            }
        }

        // arrival country
        for (uint256 a = 0; a < 2; a++) {
            Citizen.ListedCountry[] memory cntry_b;
            if (a == 0) cntry_b = Citizen.getCitizenList(citizen_id, 1);
            else if (a == 1) cntry_b = Citizen.getCitizenList(citizen_id, 2);

            for (uint256 i = 0; i < cntry_b.length; i++) {
                if (
                    keccak256(abi.encodePacked(cntry_b[i].country)) ==
                    keccak256(abi.encodePacked(citizen_ari))
                ) return (false, a);
            }
        }

        return (true, 0);
    }

    function checkWhiteListCountry(string memory dep, string memory citizen_lkl)
        public
        returns (bool)
    {
        require(
            keccak256(abi.encodePacked(countryHashMap[dep].country_name)) ==
                keccak256(abi.encodePacked(dep)),
            "Departure country does not exist"
        );
        require(
            keccak256(
                abi.encodePacked(countryHashMap[citizen_lkl].country_name)
            ) == keccak256(abi.encodePacked(citizen_lkl)),
            "Arrival country does not exist"
        );

        ListedCountry[] memory wlist = countryHashMap[dep]
            .whitelisted_countries;
        for (uint256 index = 0; index < wlist.length; index++) {
            if (
                keccak256(abi.encodePacked(wlist[index].country_name)) ==
                keccak256(abi.encodePacked(citizen_lkl))
            ) return true;
        }

        return false;
    }
}
