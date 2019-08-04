import React                from 'react';
import Component            from '../base/Component';
import FormGroup            from '../components/FormGroup';
import { Scope }            from 'informed';

export default class CoinRow extends Component {

    render() {

        const { onRemove, removable, index } = this.props;
        const showLabel = (index === 0);

        return (
            <div key={ 'coin-rows-' + index } className="coin-rows">
                <Scope scope={ 'local[' + index + ']'}>
                    <div className="form-row">
                        <FormGroup title={ showLabel && 'Code' } elementType="text" elementClass="items" elementStopAnimate="true"
                                   type="text" key={ 'local-' + index + '-ticker' } field={ 'ticker' }/>

                        <FormGroup title={ showLabel && 'Name' } elementType="text" elementClass="items" elementStopAnimate="true"
                                   type="text" key={ 'local-' + index + '-name' }   field={ 'name'   }/>

                        <FormGroup title={ showLabel && 'Address' } elementType="text" elementClass="items" elementStopAnimate="true"
                                   type="text" key={ 'local-' + index + '-wallet' } field={ 'wallet' }/>

                        <FormGroup title={ showLabel && 'Algorithm' } elementType="algoselector" elementClass="items" elementStopAnimate="true"
                                   key={ 'local-' + index + '-algo' } field={ 'algo' } hasEmpty={ true }/>

                        <div className="items">
                            { showLabel  && <label className="form-label">&nbsp;</label> }
                            { removable  && <button key={ 'local-' + index + '-remove' } type="submit" className="form-button" onClick={ onRemove }>X</button> }
                            { !removable && <button key={ 'local-' + index + '-remove' } type="submit" className="form-button" disabled>O</button> }
                        </div>
                    </div>
                </Scope>
            </div>
        )
    }

}