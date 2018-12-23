import React from 'react';
import { Row, Col } from 'reactstrap';
// import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import { createSelector } from 'reselect';
import { Title } from 'views/components/coreComponent/index';
import TitleIcon from '../../../images/icons/latest-transaction.svg';
import transactionIcon from '../../../images/icons/transactions.svg';
import { getBlockUpdateDetails } from '../../controllers/blocks/selector';

/**
 * @class LatestTransactions : To display list of latest transactions.
 */
class LatestTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionArray: [],
    };
    this.onTransactionClick = this.onTransactionClick.bind(this);
  }

  /**
   * @method onTransactionClick() :  Function to show transaction details
   * @param {object} data : Transaction detail object
   */
  onTransactionClick(props, data) {
    props.history.push({
      pathname: `/transactions/${data.transaction_hash}`,
      state: { data, type: 'transaction' },
    });
  }

  render() {
    const transactions = this.props.blockDetails.allBlockData.slice(0, 9);
    let transformedArray = [];
    let value = '';

    let transactionArr = [];
    if (transactions.length) {
      for (const block of transactions) {
        block.transactions.forEach((transac) => {
          value = `${transac.value}` || '--';
          if (transac.value !== '--') {
            value = Web3.utils.fromWei(`${value}`, 'ether');
            value = Number(value).toFixed(4);
          }
          const newVal = Web3.utils.fromWei(`${transac.value}`, 'ether');
          transactionArr = {
            block_id: block.hash,
            address_from: transac.from,
            transaction_hash: transac.transactionHash,
            address_to: transac.to,
            value: newVal,
            gasUsed: transac.gas,
            cumulativeGasUsed: transac.cumulativeGasUsed,
            contractAddress: transac.contractAddress,
            root: transac.root,
            logsBloom: transac.logsBloom,
            status: transac.status,
          };

          transformedArray.push(transactionArr);
        });
      }
    }

    transformedArray = transformedArray.slice(0, 10);
    return (
      <Col xs={12} md={6} className="left">
        <div className="header">
          <Title
            h2
            className="text-uppercase"
            style={{ backgroundImage: `url(${TitleIcon})` }}
          >
            Latest Transactions
          </Title>

          <Link to="/transactions" className="btn">
            View all
          </Link>
        </div>
        <Row className="blocks">
          {transformedArray &&
            transformedArray.length &&
            transformedArray.map((data, index) => (
              <Col
                key={index}
                xs={12}
                className="details"
                onClick={() => this.onTransactionClick(this.props, data)}
              >
                <p
                  className="tx-holder text-ellipsis ico"
                  style={{ backgroundImage: `url(${transactionIcon})` }}
                >
                  <span className="text-white">TX#</span>
                  &nbsp;
                  <span className="text-primary tx-value">
                    {data.transaction_hash}
                  </span>
                </p>
                <div className="s-to-r">
                  <p className="pb-2 mb-1 text-ellipsis">
                    <span className="text-white">From</span>
                    &nbsp;
                    <span className="text-primary from-value">
                      {data.address_from}
                    </span>
                    &nbsp;
                  </p>
                  <p className="text-ellipsis">
                    <span className="text-white ">to</span>
                    &nbsp;
                    <span className="text-primary to-value">
                      {data.address_to}
                    </span>
                  </p>
                </div>
                <div className="ammount-date">
                  <p className="mb-0">
                    <span className="text-white">Amount </span>
                    &nbsp;
                    <span className="text-primary">{value.toString()} FTM</span>
                  </p>
                  {/* <p className="time-date text-white">
                    {moment(parseInt(data.createdAt, 10)).fromNow()}
                  </p> */}
                </div>
              </Col>
            ))}
        </Row>
      </Col>
    );
  }
}

const mapStateToProps = createSelector(
  getBlockUpdateDetails(),
  (blockDetails) => ({ blockDetails })
);

export default connect(
  mapStateToProps,
  null
)(LatestTransactions);
