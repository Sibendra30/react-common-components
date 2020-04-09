import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Config from "./AutoComplete.config";
import debounce from "debounce";

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: true,
      userInput: this.props.textValue
    };
  }

  onChange = (e) => {
    const userInput = e.currentTarget.value;
      this.callAPIHook();
      this.setState({userInput});
  }

  callAPIHook = debounce(() => {
    const {minInputLength = Config.minInputLength} = this.props;
    if (this.props.onSearchCriteriaChange && this.state.userInput.length >= minInputLength) {
        this.props.onSearchCriteriaChange(this.state.userInput);
    }
  }, 500)

  fetchMoreData = () => {
    this.props.onLoadMore(this.state.userInput);
  };

  onSelect = (item) => {
    this.props.onSelectOption(item);
    this.setState({userInput: item.name, showOptions: false});
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({showOptions: true});
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({showOptions: false});
    }
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }

  getDefaultLoadingTemplate = () => {
    return (
      <div>{Config.loadingMsg}</div>
    );
  }

  getOptionsView = () => {
    const {
      listData = [], 
      hasMore = false,
      loaderTemplate = this.getDefaultLoadingTemplate
    } = this.props;

    const {localData = [], readLocal} = this.state;
    const dataToWorkWith = readLocal ? localData : listData;

    if(dataToWorkWith && dataToWorkWith.length) {
      return (
        <ul id="options-list" className="scrollable-options">
          <InfiniteScroll
            dataLength={listData.length}
            next={this.fetchMoreData}
            hasMore={hasMore}
            scrollableTarget="options-list"
            loader={loaderTemplate()}>
            {dataToWorkWith.map((item, index) => (
              <li key={index} onClick={() => {this.onSelect(item)}}>
                {item.name}
              </li>
            ))}
          </InfiniteScroll>
        </ul>
      );
    }
    return null;/*(
      <div class="no-result">
        <em>{noResultMsg}</em>
      </div>
    );*/
     
  }

  determineShowOpions = () => {
    const {userInput = '', showOptions} = this.state || {};
    const {minInputLength = Config.minInputLength} = this.props;
    if (userInput.length >= minInputLength && showOptions) {
      return true;
    }
    return false;
  }

  render() {
    const {state: {userInput = ''}, props: {textPlaceHolder = ''}} = this;

    return (
      <div className="auto-complete-search" ref={this.setWrapperRef}>
        <input
          type="text"
          placeholder={textPlaceHolder}
          onChange={this.onChange}
          value={userInput} />
        {this.determineShowOpions() && this.getOptionsView()}
      </div>
    );
  }
}

export default Autocomplete;
