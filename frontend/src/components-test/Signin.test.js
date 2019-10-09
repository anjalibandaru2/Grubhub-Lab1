import React from 'react';
import renderer from 'react-test-renderer';
import SignIn from '../components/SignIn.js'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
configure({ adapter: new Adapter() });

describe('Test case to signin as student if checkout is not checked',() =>{
        let wrapper;
        test('login as student if checkbox unchecked',()=>{
       /* wrapper = shallow(<SignIn/>);
        wrapper.find('input[type="text"][name="email]').toBeDefined();
       // wrapper.find('input[type="submit"]').simulate('click');
        //expect(wrapper.state('isFaculty')).toEqual(null);*/
        const component = renderer.create(
            <SignIn></SignIn>,
          );
          let tree = component.toJSON();
          expect(tree).toMatchSnapshot();
        });
});