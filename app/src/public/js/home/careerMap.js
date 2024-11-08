document.addEventListener('DOMContentLoaded', () => {
    initializeKnowledgeMap();
});

function initializeKnowledgeMap() {
    const data = {
        nodes: [

            { id: 1, type: "job", title: "풀스택 개발자",
                info: "프론트엔드와 백엔드를 모두 개발하는 개발자로, 웹 애플리케이션의 전체적인 구조를 설계하고 구현합니다."},
            { id: 2, type: "job", title: "클라우드 엔지니어",
                info: "클라우드 컴퓨팅 환경에서 서비스를 설계, 구현, 관리하는 전문가입니다."},
            { id: 3, type: "job", title: "소프트웨어 개발자",
                info: "다양한 소프트웨어를 개발하는 직업으로, 다양한 분야에서 프로그래밍을 통해 문제를 해결합니다."},
            { id: 4, type: "job", title: "데이터 분석가",
                info: "데이터를 수집, 정제, 분석하여 데이터 기반 의사 결정을 내릴 수 있도록 돕는 전문가입니다."},
            { id: 5, type: "job", title: "사이버 보안 전문가",
                info: "컴퓨터 시스템과 네트워크의 보안을 유지하고 정보를 보호합니다. 보안 정책, 암호화 등을 관리합니다."},
            { id: 6, type: "job", title: "AI 엔지니어",
                info: "인공지능 시스템을 개발하고 최적화하는 전문가입니다. 머신러닝, 딥러닝, 자연어 처리 기술을 활용합니다."},
            { id: 7, type: "job", title: "네트워크 관리자",
                info: "조직의 네트워크 인프라를 설계, 구축, 운영 및 유지보수하는 전문가입니다."},

            { id: 8, type: "skill", title: "JavaScript" },
            { id: 9, type: "skill", title: "React" },
            { id: 10, type: "skill", title: "Python" },
            { id: 11, type: "skill", title: "R" },
            { id: 12, type: "skill", title: "Linux" },
            { id: 13, type: "skill", title: "TensoFlow Developer" },
            { id: 14, type: "skill", title: "Bash" },

            { id: 15, type: "certificate", title: "AWS Certified Developer" },
            { id: 16, type: "certificate", title: "정보처리기사" },
            { id: 17, type: "certificate", title: "RADP(데이터분석 전문가)" },
            { id: 18, type: "certificate", title: "CISSP" },
            { id: 19, type: "certificate", title: "TensorFlow Developer" },
            { id: 20, type: "certificate", title: "CCNA" },

            { id: 21, type: "lecture", title: "웹 프로그래밍",
                linfo: "웹 환경에서 실행되는 클라이언트와 서버 프로그램 구조를 이해하고, HTML, CSS, JavaScript, PHP, MySQL 등을 활용해 동적 웹 프로그램을 개발하는 방법을 학습합니다."
            },
            { id: 22, type: "lecture", title: "리눅스 시스템",
                linfo: "UNIX/Linux 운영체제의 개념과 명령어 사용법을 배우며, 파일 시스템, 다중 사용자 환경, 편집기, 통신 명령어 등을 실습합니다."
            },
            { id: 23, type: "lecture", title: "객체지향 프로그래밍",
                linfo: "객체지향 프로그래밍의 캡슐화, 상속, 다형성 개념을 중심으로 C++을 사용해 재사용 가능한 컴포넌트를 작성하고, 객체 중심의 문제 해결 능력을 배양합니다."
            },
            { id: 24, type: "lecture", title: "데이터베이스론",
                linfo: "데이터베이스의 개념, DBMS 구성, 데이터 모델 등을 다루며 정확하고 신속한 데이터 처리를 위한 이론과 실무를 학습합니다."
            },
            { id: 25, type: "lecture", title: "컴퓨터 네트워크 및 보안",
                linfo: "데이터 통신과 네트워크의 구성, 프로토콜 설계 및 보안을 다루며, OSI 7 계층, TCP/IP, SAN 등의 프로토콜과 아날로그/디지털 통신, 해킹 기법 등을 학습합니다."
            },
            { id: 26, type: "lecture", title: "인공지능",
                linfo: "인공지능의 기초 이론을 다루며, LISP 언어, 지식 추론 등을 통해 AI 연구의 기본 소양을 기르는 것을 목표로 합니다."
            },
            { id: 27, type: "lecture", title: "컴퓨터 네트워크 및 보안",
                linfo: "데이터 통신과 네트워크의 구성, 프로토콜 설계 및 보안을 다루며, OSI 7 계층, TCP/IP, SAN 등의 프로토콜과 아날로그/디지털 통신, 해킹 기법 등을 학습합니다. "
            }

        ],
        links: [

            { source: 8, target: 9, relation: "학습 경로" },

            { source: 1, target: 8, relation: "필수 스킬" },
            { source: 3, target: 10, relation: "필수 스킬" },
            { source: 4, target: 11, relation: "필수 스킬" },
            { source: 5, target: 12, relation: "필수 스킬" },
            { source: 6, target: 13, relation: "필수 스킬" },
            { source: 7, target: 14, relation: "필수 스킬" },

            { source: 2, target: 15, relation: "추천 자격증" },
            { source: 3, target: 16, relation: "추천 자격증" },
            { source: 4, target: 17, relation: "추천 자격증" },
            { source: 5, target: 18, relation: "추천 자격증" },
            { source: 6, target: 19, relation: "추천 자격증" },
            { source: 7, target: 20, relation: "추천 자격증" },

            { source: 9, target: 21, relation: "전공 강의" },
            { source: 15, target: 22, relation: "전공 강의" },
            { source: 10, target: 23, relation: "전공 강의" },
            { source: 11, target: 24, relation: "전공 강의" },
            { source: 12, target: 25, relation: "전공 강의" },
            { source: 13, target: 26, relation: "전공 강의" },
            { source: 14, target: 27, relation: "전공 강의" },

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
        .attr('fill', d => {
            switch(d.type) {
                case 'job' : return '#34429c'; // job 색깔
                case 'skill' : return '#7bbaf5'; // skill 색깔
                case 'certificate' : return '#708090' // certificate 색깔
                default: return '#b0e0e6'; // lecture 색깔
            }
        })

        .on('click', function(event, d) {
            if (d.type === 'job') {  // job 클릭 시 팝업 생성
                showJobPopup(event, d);
            } else if (d.type === 'lecture') {  // lecture 클릭 시 팝업 생성
                showLecturePopup(event, d);
            }
        })

        node.on('mouseover', function(event, d) {
            if (d.type === 'job') {
                d3.select(this)
                    .style('cursor', 'pointer'); // job 노드 클릭 시 커서 변경
            } else if (d.type === 'lecture') {
                d3.select(this)
                    .style('cursor', 'pointer'); // lecture 노드 클릭 시 커서 변경
            }
        })

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
        .attr('font-size', '13px')
        .attr('fill', '#333')
        .text(d => d.title);

    // 링크 레이블 생성
    const linkLabel = svg.selectAll('.link-label')
        .data(data.links)
        .enter()
        .append('text')
        .attr('font-size', '11px')
        .attr('fill', '#666')
        .text(d => d.relation);

    // job 팝업
    let activePopup = null;

    function showJobPopup(event, nodeData) { // 팝업 생성 노드 재클릭 시 생성 팝업 닫기

        if (activePopup && activePopup.node().dataset.nodeId === nodeData.id.toString()) {
            d3.selectAll('.popup').remove(); // 기존 팝업 닫기
            activePopup = null; // 팝업 상태 초기화
            return;
        }

        d3.selectAll('.popup').remove(); // 기존 팝업 제거

        activePopup = d3.select('body')
            .append('div')
            .attr('class', 'popup')
            .attr('data-node-id', nodeData.id) // 팝업에 해당 노드의 ID 저장
            .style('position', 'absolute')
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
            .style('background-color', '#fff')
            .style('border', '1px solid #ccc')
            .style('padding', '20px')
            .style('width', '300px')
            .style('font-size', '16px')
            .style('border-radius', '5px')
            .style('box-shadow', '0px 4px 8px rgba(0, 0, 0, 0.2)')
            .style('visibility', 'visible')
            .html(`<strong>${nodeData.title}</strong><br>${nodeData.info}`);

        // 팝업 외부 클릭 시 팝업 닫기
        document.addEventListener('click', function closePopupOnClickOutside(event) {
            const isClickInsidePopup = activePopup.node().contains(event.target);
            const isClickOnJobNode = event.target.tagName === 'circle';

            // 팝업 외부를 클릭한 경우
            if (!isClickInsidePopup && !isClickOnJobNode) {
                d3.selectAll('.popup').remove();
                activePopup = null;
                document.removeEventListener('click', closePopupOnClickOutside); // 리스너 제거
            }
        });
    }

    // lecture 팝업 생성 함수
    function showLecturePopup(event, nodeData) {

        if (activePopup && activePopup.node().dataset.nodeId === nodeData.id.toString()) {
            d3.selectAll('.popup').remove(); // 기존 팝업 닫기
            activePopup = null; // 팝업 상태 초기화
            return;
        }

        // 기존 팝업 제거
        d3.selectAll('.popup').remove();

        // lecture에 대한 새로운 팝업 생성
        activePopup = d3.select('body')
            .append('div')
            .attr('class', 'popup')
            .attr('data-node-id', nodeData.id)
            .style('position', 'absolute')
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY - 30}px`)
            .style('background-color', '#fff')
            .style('border', '1px solid #ccc')
            .style('padding', '20px')
            .style('width', '250px')
            .style('font-size', '16px')
            .style('border-radius', '5px')
            .style('box-shadow', '0px 4px 8px rgba(0, 0, 0, 0.2)')
            .style('visibility', 'visible')
            .html(`<strong>${nodeData.title}</strong><br>${nodeData.linfo || "강의 내용이 없습니다."}`); // 강의에 대한 정보를 표시

        // 팝업 외부 클릭 시 팝업 닫기
        document.addEventListener('click', function closePopupOnClickOutside(event) {
            const isClickInsidePopup = activePopup.node().contains(event.target);
            const isClickOnLectureNode = event.target.tagName === 'circle';

            if (!isClickInsidePopup && !isClickOnLectureNode) {
                d3.selectAll('.popup').remove();
                activePopup = null;
                document.removeEventListener('click', closePopupOnClickOutside);
            }
        });
    }

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