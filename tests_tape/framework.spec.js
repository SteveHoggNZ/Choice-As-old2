import { h, sh } from './test_util'

h('----------------------------')

// import test from 'blue-tape'
//
// const t = (name, cb) => test(`- ${name}`, cb)
//
// t('nested test', function (a) {
//     const tt = (name, cb) => a.test(`-- ${name}`, cb)
//
//     tt('test a', function (aa) {
//         aa.plan(1);
//         aa.equal(1+3, 4, '4 equals 4');
//     });
//
//     tt('test b', function (aa) {
//         aa.plan(1);
//         aa.equal(2+3, 5, '5 equals 3');
//     });
//
//     tt('test c', function (aa) {
//         aa.plan(1);
//         aa.equal(2+3, 5, '5 equals 5');
//     });
// });

// import assert from 'assert'
// import React from 'react'
// import {mount, render, shallow} from 'enzyme'
//
// class Fixture extends React.Component {
//   render () {
//     return (
//       <div>
//         <input id='checked' defaultChecked />
//         <input id='not' defaultChecked={false} />
//       </div>
//     )
//   }
// }
//
// describe('(Framework) Karma Plugins', function () {
//   it('Should expose "expect" globally.', function () {
//     assert.ok(expect)
//   })
//
//   it('Should expose "should" globally.', function () {
//     assert.ok(should)
//   })
//
//   it('Should have chai-as-promised helpers.', function () {
//     const pass = new Promise(res => res('test'))
//     const fail = new Promise((res, rej) => rej())
//
//     return Promise.all([
//       expect(pass).to.be.fulfilled,
//       expect(fail).to.not.be.fulfilled
//     ])
//   })
//
//   it('should have chai-enzyme working', function() {
//     let wrapper = shallow(<Fixture />)
//     expect(wrapper.find('#checked')).to.be.checked()
//
//     wrapper = mount(<Fixture />)
//     expect(wrapper.find('#checked')).to.be.checked()
//
//     wrapper = render(<Fixture />)
//     expect(wrapper.find('#checked')).to.be.checked()
//   })
// })
