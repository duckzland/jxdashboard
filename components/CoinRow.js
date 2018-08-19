import React                from 'react';
import Component            from '../base/Component';
import AlgoSelector         from '../components/AlgoSelector';
import { Text, Checkbox, Select, Scope } from 'informed';

export default class CoinRow extends Component {

    render() {

        const { onRemove, index } = this.props;
        const showLabel = (index === 0);

        return (
            <div key={ 'coin-rows-' + index } className="coin-rows">
                <Scope scope={ 'local[' + index + ']'}>
                    <div className="form-row">
                        <div className="items">
                            { showLabel && <label className="form-label">Code</label> }
                            <Text type="text" key={ 'local-' + index + '-ticker' } field={ 'ticker' }/>
                        </div>
                        <div className="items">
                            { showLabel && <label className="form-label">Name</label> }
                            <Text type="text" key={ 'local-' + index + '-name' }   field={ 'name'   }/>
                        </div>
                        <div className="items">
                            { showLabel && <label className="form-label">Wallet</label> }
                            <Text type="text" key={ 'local-' + index + '-wallet' } field={ 'wallet' }/>
                        </div>
                        <div className="items">
                            { showLabel && <label className="form-label">Algorithm</label> }
                            <AlgoSelector key={ 'local-' + index + '-algo' } field={ 'algo' } hasEmpty={ true }/>
                        </div>
                        <div className="items">
                            { showLabel && <label className="form-label">Action</label> }
                            <button key={ 'local-' + index + '-remove' } type="submit" className="form-button" onClick={ onRemove }>X</button>
                        </div>
                    </div>
                </Scope>
            </div>
        )
    }

}