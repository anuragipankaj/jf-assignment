export default function authHeader() {
    const data = JSON.parse(localStorage.getItem('user'));

    if (data && data.session) {
        return { 'x-access-token': data.session.token };
    } else {
        return {};
    }
}