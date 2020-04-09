import React, {Component} from 'react';
import Autocomplete from "./components/Autocomplete";
import data from "./data.json";

export default class Register extends Component {

    fetchMoreData = (searchData) => {
        const {listData = [], query = {}} = this.state || {};
        const {start = 0, limit = 10} = query;
        const filteredRes = data.filter(item => item.name.toLowerCase().startsWith(searchData.toLowerCase()));
        const totalCount = filteredRes.length;
        const dataAfterPagination = filteredRes.splice(start, limit);
        setTimeout(() => {
            const query = {
                start: start + 10,
                limit: 10,
                totalCount
            };
            this.setState({listData: [...listData, ...dataAfterPagination], query});
        }, 200);
    }

    fetchData = (userInput) => {
        const filteredRes = data.filter(item => item.name.toLowerCase().startsWith(userInput.toLowerCase()));
        const totalCount = filteredRes.length;
        const dataAfterPagination = filteredRes.splice(0, 10);
        setTimeout(() => {
            const query = {
                start: 10,
                limit: 10,
                totalCount
            };
            this.setState({listData: dataAfterPagination, query});
        }, 300);
    }

    onSelectOption = (item) => {
        console.log('Hook to handle after option selection event', item);
    }

    render () {
        const {listData = [], query = {}} = this.state || {};
        const {start, totalCount} = query;
        return (
            <div className="mx-2">
                <Autocomplete
                    onSelectOption={this.onSelectOption}
                    hasMore={totalCount - start > 0} 
                    onSearchCriteriaChange={this.fetchData}
                    onLoadMore={this.fetchMoreData}
                    listData={listData} />
            </div>);
    }

}