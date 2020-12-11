import React from "react";
import "./homepage.css"

class Homepage extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            countriesList: [],
            citiesList: [],
            cityWeatherData: [undefined,undefined,undefined,undefined,undefined]
        }
    };

    componentDidMount()
    {
        this.getAllCountries();
    }

    getWeatherByCoordinates = (coordinate) =>
    {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinate.latitude}&lon=${coordinate.longitude}&units=metric&appid=c984334279d7f9da1a0f2882480cbaee`, {
            "method": "GET",
            "headers": {}
        })
            .then(response => response.json())
            .then(response =>
            {
                this.setState({
                    countriesList: this.state.countriesList,
                    citiesList: this.state.citiesList,
                    cityWeatherData: [
                        response,
                        this.state.cityWeatherData[0],
                        this.state.cityWeatherData[1],
                        this.state.cityWeatherData[2],
                        this.state.cityWeatherData[3],
                    ]
                })
            })
            .catch(err => { console.log(err); });
    }
    getAllCountries = () =>
    {
        fetch('https://parseapi.back4app.com/classes/Continentscountriescities_Country?limit=300&order=name&keys=name', {
            headers: {
                'X-Parse-Application-Id': 'kxkbkvKN9lQ9bOytW7hT8El1nFW4GxHS8NriZ455',
                'X-Parse-REST-API-Key': '4VVrUX0WRAbbMSmrdfx6BePGX7avBDtSJOv5BKQZ',
            }
        })
            .then(response => response.json())
            .then(response =>
            {
                this.setState({
                    countriesList: response.results,
                    citiesList: this.state.citiesList,
                    cityWeatherData: this.state.cityWeatherData
                })
            })
            .catch(err => { console.log(err); });
    }

    getCitiesFromCountry = (countryId) =>
    {
        const where = encodeURIComponent(JSON.stringify({
            "country": {
                "__type": "Pointer",
                "className": "Continentscountriescities_Country",
                "objectId": countryId
            }
        }));
        fetch(`https://parseapi.back4app.com/classes/Continentscountriescities_City?limit=100000&order=name&where=${where}`, {
                headers: {
                    'X-Parse-Application-Id': 'kxkbkvKN9lQ9bOytW7hT8El1nFW4GxHS8NriZ455',
                    'X-Parse-REST-API-Key': '4VVrUX0WRAbbMSmrdfx6BePGX7avBDtSJOv5BKQZ',
                }
        })
            .then(response => response.json())
            .then(response =>
            {
                this.setState({
                    countriesList: this.state.countriesList,
                    citiesList: response.results,
                    cityWeatherData: this.state.cityWeatherData
                })
            })
            .catch(err => { console.log(err); });
    }

    countrySelectOnChange = (event) =>
    {
        const selectedCountryId = this.state.countriesList[event.target.value].objectId;
        this.getCitiesFromCountry(selectedCountryId);
    }
    citySelectOnChange = (event) =>
    {
        const selectedCityCoordinates = { latitude: this.state.citiesList[event.target.value].location.latitude,
                                          longitude: this.state.citiesList[event.target.value].location.longitude };
        this.getWeatherByCoordinates(selectedCityCoordinates);
    }

    createCountrySelectItems = () =>
    {
        let itemsList = []
        for ( let i = 0; i < this.state.countriesList.length; i++)
        {
            itemsList.push(<option value = {i}
                                   key = {i + this.state.countriesList[i].name}
            >{this.state.countriesList[i].name}</option>)
        }
        return itemsList;
    }
    createCitySelectItems = () =>
    {
        let itemsList = []
        for ( let i = 0; i < this.state.citiesList.length; i++)
        {
            itemsList.push(<option value = {i}
                                   key = {i + this.state.citiesList[i].name}
            >{this.state.citiesList[i].name}</option>)
        }
        return itemsList;
    }
    addLeadingZero = (i) => { return i < 10 ? ("0" + i) : i; }
    displayEachWeatherData = (i) =>
    {
        if ( this.state.cityWeatherData[i] === undefined)
        {
            return
        }
        let sunriseDate = new Date(this.state.cityWeatherData[i].sys.sunrise * 1000);
        let sunsetDate = new Date(this.state.cityWeatherData[i].sys.sunset * 1000);
        let sunriseTime = this.addLeadingZero(sunriseDate.getHours()) + ":"
            + this.addLeadingZero(sunriseDate.getUTCMinutes());
        let sunsetTime = this.addLeadingZero(sunsetDate.getHours()) + ":"
            + this.addLeadingZero(sunsetDate.getUTCMinutes());
        return (
            <div id = "temperaturePanel">
                <p id = "locationField">
                    {this.state.cityWeatherData[i].name}, {this.state.cityWeatherData[i].sys.country}
                </p>
                <p id = "temperatureField">{this.state.cityWeatherData[i].main.temp} &#8451;</p>
                <p id = "descriptionField">{this.state.cityWeatherData[i].weather[0].main}</p>
                <p id = "temperatureFeelField">Feels like {this.state.cityWeatherData[i].main.feels_like} &#8451;</p>
                <p id = "sunriseField">Sunrise time {sunriseTime}</p>
                <p id = "sunriseField">Sunset time{sunsetTime}</p>
            </div>
        )
    }

    displayWeatherData = () =>
    {
        let weatherPanelRow = [];
        for ( let i = 0; i < this.state.cityWeatherData.length; i++ )
        {
            weatherPanelRow.push(this.displayEachWeatherData(i));
        }
        return weatherPanelRow;
    }

    render()
    {
        return (
            <div>
                <h1>Welcome {this.props.loggedUser}!</h1>
                <h2>To see weather condition select location.</h2>
                <div>
                    <p>Country</p>
                    <select onChange = {this.countrySelectOnChange} defaultValue = {50} id = "countrySelect">
                    {
                        this.createCountrySelectItems()
                    }
                    </select>
                    <br/><br/>
                    <p>City</p>
                    <select onChange = {this.citySelectOnChange} defaultValue = {""} id = "citySelect">
                        <option value = "" disabled hidden>-</option>
                        {
                            this.createCitySelectItems()
                        }
                    </select>
                </div>
                <div id = "weatherDataRow">
                    { this.displayWeatherData() }
                </div>
            </div>
        );
    }
}
export default Homepage;