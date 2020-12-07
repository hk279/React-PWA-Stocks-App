import React, { useState } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Select, PageHeader } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const { Option } = Select;

function App() {
    const [data, setData] = useState([]);

    function handleChange(value) {
        loadStock(value);
    }

    function loadStock(stock) {
        console.log(stock);
        const url =
            "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" +
            stock +
            "&apikey=" +
            process.env.REACT_APP_API_KEY;

        console.log(url);
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const keys = Object.keys(data["Time Series (Daily)"]);
                var dataEndIndex = 10;
                var localData = [];

                keys.forEach((key, index) => {
                    if (index < dataEndIndex) {
                        localData.push({
                            date: key,
                            open: data["Time Series (Daily)"][key]["1. open"],
                            high: data["Time Series (Daily)"][key]["2. high"],
                            low: data["Time Series (Daily)"][key]["3. low"],
                            close: data["Time Series (Daily)"][key]["4. close"],
                            volume: data["Time Series (Daily)"][key]["5. volume"],
                        });
                    }
                });

                console.log(localData);
                setData(localData);
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className="App">
            <PageHeader title="Stock App"></PageHeader>
            <Select defaultValue="AAPL" onChange={(value) => handleChange(value)}>
                <Option value="AAPL">Apple</Option>
                <Option value="AMZN">Amazon</Option>
                <Option value="NOK">Nokia</Option>
                <Option value="TSLA">Tesla</Option>
            </Select>
            <div style={{ width: "90%", height: "400px" }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={["dataMin", "dataMax"]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="open" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="close" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="high" stroke="#ff0000" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default App;
