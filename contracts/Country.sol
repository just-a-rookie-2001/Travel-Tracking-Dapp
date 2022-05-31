// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "./Citizen.sol";

contract Country {
    struct ListedCountry {
        string country_name;
        uint256 duration;
    }

    struct ListedCitizen {
        uint256 id;
        uint256 duration;
    }

    struct country {
        string country_name;
        ListedCountry[] blacklisted_countries;
        ListedCountry[] graylisted_countries;
        ListedCountry[] whitelisted_countries;
        ListedCitizen[] blacklisted_citizens;
        ListedCitizen[] graylisted_citizens;
        ListedCitizen[] whitelisted_citizens;
    }

    mapping(string => country) countryHashMap;
    Citizen c;

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
        countryHashMap[cn].blacklisted_citizens = [ListedCitizen(0, 0)];
        countryHashMap[cn].graylisted_citizens = [ListedCitizen(0, 0)];
        countryHashMap[cn].whitelisted_citizens = [ListedCitizen(0, 0)];
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

    function list_citizen(
        string memory country_name,
        uint256 list_citizen_id,
        uint256 duration,
        uint8 list
    ) public {
        require(
            keccak256(
                abi.encodePacked(countryHashMap[country_name].country_name)
            ) == keccak256(abi.encodePacked(country_name)),
            "This country does not exist"
        );
        uint256 cit_id = c.getCitizen(list_citizen_id).id;
        if (list == 1)
            countryHashMap[country_name].blacklisted_citizens.push(
                ListedCitizen(cit_id, duration)
            );
        else if (list == 2)
            countryHashMap[country_name].graylisted_citizens.push(
                ListedCitizen(cit_id, duration)
            );
        else if (list == 3)
            countryHashMap[country_name].whitelisted_citizens.push(
                ListedCitizen(cit_id, duration)
            );
    }

    function checkListCountry(uint256 citizen_id)
        public
        view
        returns (bool, uint256)
    {
        string memory citizen_dep = c.getCitizenDeparture(citizen_id);
        string memory citizen_ari = c.getCitizenArrival(citizen_id);
        string[] memory citizen_cc = c.getCitizenConnectingCountries(
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
        // string memory citizen_dep = c.getCitizenDeparture(citizen_id);
        string memory citizen_ari = c.getCitizenArrival(citizen_id);
        string[] memory citizen_cc = c.getCitizenConnectingCountries(
            citizen_id
        );

        // connecting countries
        for (uint256 a = 0; a < 2; a++) {
            ListedCitizen[] memory cntry_b;
            for (uint256 index = 0; index < citizen_cc.length; index++) {
                if (a == 0)
                    cntry_b = countryHashMap[citizen_cc[index]]
                        .blacklisted_citizens;
                else if (a == 1)
                    cntry_b = countryHashMap[citizen_cc[index]]
                        .graylisted_citizens;

                for (uint256 i = 0; i < cntry_b.length; i++) {
                    if (cntry_b[i].id == citizen_id) return (false, a);
                }
            }
        }

        // arrival country
        for (uint256 a = 0; a < 2; a++) {
            ListedCitizen[] memory cntry_b;
            if (a == 0)
                cntry_b = countryHashMap[citizen_ari].blacklisted_citizens;
            else if (a == 1)
                cntry_b = countryHashMap[citizen_ari].graylisted_citizens;

            for (uint256 i = 0; i < cntry_b.length; i++) {
                if (cntry_b[i].id == citizen_id) return (false, a);
            }
        }

        return (true, 0);
    }
}
