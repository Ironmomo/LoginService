import app from '../../src/app'
import request from 'supertest'
import getInstance from '../../src/db/sql/SQLDBConnector'
import config from '../../src/config/default'


describe('End to End Test', () => {

    describe('Authentication', () => {

        it('check valid login', () => {
            return request(app)
            .post('/pwd/auth')
            .send('username=user1&password=compass1.')
            .expect(200)

        })

        it('check non existing user', () => {
            return request(app)
            .post('/pwd/auth')
            .send('username=nonExisting&password=compass1.')
            .expect(400, { message: 'Invalid Username or Password' })
        })

        it('check existing user but wrong password', () => {
            return request(app)
            .post('/pwd/auth')
            .send('username=user1&password=wrongpassword.')
            .expect(400, { message: 'Invalid Username or Password' })
        })

        it('check invalid payload', () => {
            return request(app)
            .post('/pwd/auth')
            .send('nonvalid=user1&password=wrongpassword.')
            .expect(400, { message: 'No valid Request body' })
        })

        it('check too many login attempts', async () => {
            // make valid login
            await request(app)
            .post('/pwd/auth')
            .send('username=user1&password=compass1.')
            .expect(200)

            for (let i = 0; i < config.MAX_LOGIN_ATTEMPT; i++) {
                // make invalid login
                await request(app)
                .post('/pwd/auth')
                .send('username=user1&password=invalidpwd.')
                .expect(400, { message: 'Invalid Username or Password' })
            }

            return request(app)
            .post('/pwd/auth')
            .send('username=user1&password=compass1.')
            .expect(400, { message: 'Tried too many times' })
        })
    })

    afterEach(async () => {
        await getInstance().executeQuery("UPDATE user_table SET login_count = 0 WHERE username = 'user1'")
    })

    afterAll(() => {
        getInstance().handleExit()
    })
})