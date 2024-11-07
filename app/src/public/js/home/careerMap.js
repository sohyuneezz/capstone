document.addEventListener('DOMContentLoaded', () => {
    initializeKnowledgeMap();
});

function initializeKnowledgeMap() {
    const data = {
        nodes: [
            { id: 1, type: "job", title: "프론트엔드 개발자" },
            { id: 2, type: "job", title: "풀스택 개발자" },
            { id: 3, type: "skill", title: "JavaScript" },
            { id: 4, type: "skill", title: "React" },
            { id: 5, type: "certificate", title: "AWS Certified Developer" },
            { id: 6, type: "job", title: "클라우드 엔지니어" },
            { id: 7, type: "job", title: "소프트웨어 개발자" },
            { id: 8, type: "job", title: "데이터 분석가" },
            { id: 9, type: "job", title: "사이버 보안 전문가" },
            { id: 10, type: "job", title: "AI 엔지니어" },
            { id: 11, type: "job", title: "네트워크 관리자" },
            { id: 12, type: "skill", title: "Python" },
            { id: 13, type: "skill", title: "R" },
            { id: 14, type: "skill", title: "Linux" },
            { id: 15, type: "skill", title: "TensoFlow Developer" },
            { id: 16, type: "skill", title: "Bash" },
            { id: 17, type: "certificate", title: "정보처리기사" },
            { id: 18, type: "certificate", title: "RADP(데이터분석 전문가)" },
            { id: 19, type: "certificate", title: "CISSP" },
            { id: 20, type: "certificate", title: "TensorFlow Developer" },
            { id: 21, type: "certificate", title: "CCNA" }
        ],
        links: [
            { source: 3, target: 4, relation: "학습 경로" },
            { source: 4, target: 1, relation: "필수 스킬" },
            { source: 1, target: 2, relation: "경력 발전" },
            { source: 5, target: 6, relation: "추천 자격증" },
            { source: 7, target: 12, relation: "필수 스킬" },
            { source: 8, target: 13, relation: "필수 스킬" },
            { source: 9, target: 14, relation: "필수 스킬" },
            { source: 10, target: 15, relation: "필수 스킬" },
            { source: 11, target: 16, relation: "필수 스킬" },
            { source: 12, target: 17, relation: "추천 자격증" },
            { source: 13, target: 18, relation: "추천 자격증" },
            { source: 14, target: 19, relation: "추천 자격증" },
            { source: 15, target: 20, relation: "추천 자격증" },
            { source: 16, target: 21, relation: "추천 자격증" },

        ],
    };

    const visualization = document.getElementById('careerMap');
    const width = visualization.clientWidth;
    const height = visualization.clientHeight;

    const svg = d3.select('#careerMap')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(150)) // 거리 감소
        .force('charge', d3.forceManyBody().strength(-100)) // 노드 추가 후 밀어내는 힘 감소
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', ticked); // tick 이벤트 연결

    // 링크 생성
    const link = svg.selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke-width', 2)
        .attr('stroke', '#aaa');

    // 노드 생성
    const node = svg.selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', 12)
        .attr('fill', d => (d.type === 'job' ? '#34429c' : '#7bbaf5'))
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded)
        );

    // 노드 레이블 생성
    const label = svg.selectAll('text')
        .data(data.nodes)
        .enter()
        .append('text')
        .attr('dy', 4)
        .attr('x', 15)
        .attr('font-size', '12px')
        .attr('fill', '#333')
        .text(d => d.title);

    // 링크 레이블 생성
    const linkLabel = svg.selectAll('.link-label')
        .data(data.links)
        .enter()
        .append('text')
        .attr('font-size', '10px')
        .attr('fill', '#666')
        .text(d => d.relation);

    // tick 이벤트에서 위치 업데이트
    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x = bounce(d.x, 0, width))
            .attr('cy', d => d.y = bounce(d.y, 0, height));

        label
            .attr('x', d => d.x + 15)
            .attr('y', d => d.y + 4);

        linkLabel
            .attr('x', d => (d.source.x + d.target.x) / 2)
            .attr('y', d => (d.source.y + d.target.y) / 2);
    }

    // 경계에서 튕기는 효과 함수
    function bounce(value, min, max) {
        if (value < min) return min + (min - value); // 왼쪽 또는 위쪽 경계에서 튕김
        if (value > max) return max - (value - max); // 오른쪽 또는 아래쪽 경계에서 튕김
        return value;
    }

    // 드래그 이벤트 핸들러
    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}