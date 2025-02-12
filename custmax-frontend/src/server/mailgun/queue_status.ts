async function getStatus() {
    const name = 'email-marketing-hub.com';

    const resp = await fetch(
        `https://api.mailgun.net/v3/domains/${name}/sending_queues`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + btoa('api:88afb8030841f9b9da098e9eac52a164-ed54d65c-307e17c7')
            }
        }
    );

    if (!resp.ok) {
        console.error('Failed to fetch data:', resp.status, resp.statusText);
        return;
    }

    const data = await resp.json();
    console.log('Queue data:', data);

    // 根据返回数据结构检查发送队列状态
    if (data.total_count === 0) {
        console.log('All emails have been sent.');
    } else {
        console.log('There are still emails in the queue.');
    }

}

export default getStatus;