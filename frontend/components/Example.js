import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeCount } from '../store/toolbar/actions'


export default function Example() {
    const count = useSelector(state => state.toolbar.count);
    const dispatch = useDispatch();

    console.log(count);

    useEffect(() => {
        document.title = `Вы нажали ${count} раз`;
    }, [count]);

    return (
    <div>
        <button onClick={() => dispatch(changeCount(count + 1))}>
        Нажми на меня
        </button>
    </div>
    );
}