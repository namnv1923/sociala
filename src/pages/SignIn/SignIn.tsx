import { FC, useCallback } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Input, Form, Button, message } from 'antd';
import classNames from 'classnames/bind';
import styles from './SignIn.module.scss';
import images from '@assets/images';
import { LogoIcon } from '@components/Icons';
import { signInWithGoogle, logInWithEmailAndPassword } from '@utils/authen';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { setUser } from '@slices/userSlice';
import ROUTE_PATH from '@constants/routes';

const cx = classNames.bind(styles);

const SignInPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { user } = useAppSelector((state) => state.user);

    const handleLoginWithGoogle = useCallback(async () => {
        const user = await signInWithGoogle();
        if (user) {
            dispatch(
                setUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                }),
            );
            message.success('Login success!');
        } else {
            message.error('Login failure! Please, again!');
        }
    }, [dispatch]);

    const handleLogin = useCallback(
        async (formData: any) => {
            const user = await logInWithEmailAndPassword(formData.email, formData.password);
            if (user) {
                dispatch(
                    setUser({
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    }),
                );
                message.success('Login success!');
            } else {
                message.error('Login failure! Please, again!');
            }
        },
        [dispatch],
    );

    return (
        <>
            {user ? (
                <Navigate to={ROUTE_PATH.HOME} />
            ) : (
                <div className={cx('wrapper')}>
                    <div className={cx('inner')}>
                        <h3 className={cx('logo')}>
                            <LogoIcon width="3.2rem" height="3.2rem" className={cx('logo-icon')} />
                            Sociala
                        </h3>
                        <h1 className={cx('heading')}>????ng nh???p v??o Sociala</h1>
                        <div className={cx('provider')}>
                            <span className={cx('google')} onClick={handleLoginWithGoogle}>
                                <img src={images.googleLogo} alt="" />
                            </span>
                        </div>
                        <p className={cx('description')}>Ho???c ????ng nh???p v???i email v?? m???t kh???u c???a b???n:</p>
                        <div className={cx('form')}>
                            <Form name="login" form={form} onFinish={handleLogin} autoComplete="off">
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please input your email!' },
                                        { type: 'email', message: 'Invalid email format!' },
                                    ]}
                                >
                                    <Input className={cx('input')} placeholder="Your email" autoComplete="off" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                        {
                                            min: 6,
                                            message: 'Password minimum 6 characters!',
                                        },
                                    ]}
                                >
                                    <Input.Password className={cx('input')} placeholder="Password" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className={cx('login')}>
                                        Login
                                    </Button>
                                    <Button
                                        type="primary"
                                        ghost
                                        className={cx('create')}
                                        onClick={() => navigate(ROUTE_PATH.REGISTER)}
                                    >
                                        Create account
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <p className={cx('forgot-pw')}>
                            <Link to="/">Qu??n m???t kh???u?</Link>
                        </p>
                        <p className={cx('terms')}>
                            Vi???c b???n ti???p t???c s??? d???ng trang web n??y ?????ng ngh??a b???n ?????ng ?? v???i
                            <span className={cx('highlight')}> ??i???u kho???n s??? d???ng</span> c???a ch??ng t??i.
                        </p>
                    </div>
                    <div className={cx('background')} style={{ backgroundImage: `url('${images.bgLogin}')` }}></div>
                </div>
            )}
        </>
    );
};

export default SignInPage;
