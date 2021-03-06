var React = require('react');
var mixins = require('baobab-react/mixins');
var Link = require('react-router').Link;
var Modal = require('react-bootstrap/lib/Modal');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var i18n = require('i18next-client');

module.exports = React.createClass({
  displayName: 'Donate',
  mixins: [
    mixins.branch,
    PureRenderMixin,
  ],
  cursors: {
    lng: ['lng'],
  },

  render: function() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.t('Donate')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h4>{i18n.t('Why donate?')}</h4>
          <p>
            {i18n.t('Donating to uApp Explorer is just one way you can help make it better. If you choose to donate, you money will go towards infrastructure costs. Costs include domain names, hosting, etc. uApp Explorer will always be a free and open source service, regardless of the number of donations.')}
          </p>
          <p>
            {i18n.t('Whether you choose to donate or not, I still appreciate you support. Thank you!')}
            <br/>
            - Brian
          </p>

          <h4>{i18n.t('Donate via Paypal')}</h4>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----" />
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt={i18n.t('Donate via Paypal')} />
          </form>

          <h4>{i18n.t('Donate via Bitcoin')}</h4>
          <div>
            <i className="fa fa-btc"></i> 18QvvyHWxvXWDcH2Mf9McjQNrjDHuYKYtP
          </div>
        </Modal.Body>

        <Modal.Footer>
          <a className="btn btn-info" onClick={this.props.onHide}>{i18n.t('Thank you!')}</a>
        </Modal.Footer>
      </Modal>
    );
  }
});
